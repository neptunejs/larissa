// @flow
import Graph from 'graph.js/dist/graph.full';

import Block from './Block';
import GraphEdge from './GraphEdge';
import MapLoop from './MapLoop';
import Node, {INSTANTIATED, READY} from './Node';
import LinkedPort from './LinkedPort';

import InputPort from './InputPort';
import OutputPort from './OutputPort';

import type Environment from './Environment';
import type {NodeStatus} from './Node';

export default class Pipeline extends Node {
    env: Environment;
    graph: Graph;
    _nodes: Set<Node>;
    linkedInputs: Map<string, LinkedPort>;
    linkedOutputs: Map<string, LinkedPort>;

    constructor(env: Environment, id: ?string) {
        super(id);
        this.env = env;
        this.graph = new Graph();
        this._nodes = new Set();
        this.title = 'Pipeline';
        this.linkedInputs = new Map();
        this.linkedOutputs = new Map();
        this.computeStatus();
    }

    get kind(): string {
        return 'pipeline';
    }

    findNode(nodeId: string) {
        for (const node of this.nodes()) {
            if (node.id === nodeId) {
                return node;
            }
        }
        return null;
    }

    * nodes(): Iterator<Node> {
        yield this;
        for (const node of this._nodes) {
            if (node instanceof Pipeline) {
                yield* node.nodes();
            } else {
                yield node;
            }
        }
    }

    connect(nodeOutput: Node | OutputPort, nodeInput: Node | InputPort) {
        if (nodeOutput instanceof Node) {
            nodeOutput = nodeOutput.output();
        }
        if (nodeInput instanceof Node) {
            nodeInput = nodeInput.input();
        }
        const outputNode: Node = nodeOutput.node;
        const inputNode: Node = nodeInput.node;

        if (nodeInput.type && nodeOutput.type && nodeInput.type !== nodeOutput.type) {
            throw new Error(`node types are not compatible: ${nodeOutput.type} - ${nodeInput.type}`);
        }

        if (!this._nodes.has(outputNode)) {
            throw new Error(`output node ${outputNode.id} not found in pipeline`);
        }
        if (!this._nodes.has(inputNode)) {
            throw new Error(`input node ${inputNode.id} not found in pipeline`);
        }
        // TODO: find single type match between node1 outputs and node2 inputs ?
        // TODO: check that the types of node1's output is compatible with node2's input
        let edge: GraphEdge;
        if (this.graph.hasEdge(outputNode.id, inputNode.id)) {
            edge = this.graph.edgeValue(outputNode.id, inputNode.id);
        } else {
            edge = new GraphEdge(outputNode, inputNode);
            this.graph.addNewEdge(outputNode.id, inputNode.id, edge);
            if (this.graph.hasCycle()) {
                this.graph.removeExistingEdge(outputNode.id, inputNode.id);
                throw new Error(`cannot connect nodes ${outputNode.id} and ${inputNode.id} because of cycle`);
            }
        }
        edge.addConnection(nodeOutput, nodeInput);
        this.emit('change');
    }

    getNode(id: string): Node | null {
        for (let node of this._nodes) {
            if (node.id === id) {
                return node;
            }
        }
        return null;
    }

    inspect() {
        return {
            node: this.toJSON(),
            status: this.status,
            inputCandidates: this.getInputCandidates(),
            outputCandidates: this.getOutputCandidates()
        };
    }

    getInputCandidates() {
        const inputs = [];
        for (let node of this._nodes.values()) {
            const nodeData = node.toJSON();
            for (let input of node.inputs.values()) {
                inputs.push({
                    info: input.toJSON(),
                    node: nodeData
                });
            }
        }
        return inputs;
    }

    getOutputCandidates() {
        const outputs = [];
        for (let node of this._nodes.values()) {
            const nodeData = node.toJSON();
            for (let output of node.outputs.values()) {
                outputs.push({
                    info: output.toJSON(),
                    node: nodeData
                });
            }
        }
        return outputs;
    }

    addNode(node: Node): void {
        if (this._nodes.has(node)) {
            throw new Error('node is already in pipeline');
        }
        addNodeToGraph(node, this);
        this.emit('change');
    }

    newNode(identifier: string, options?: Object, id: ?string): Node {
        const blockType = this.env.getBlock(identifier);
        const node = new Block(blockType, options, id);
        addNodeToGraph(node, this);
        this.emit('change');
        return node;
    }

    newLoop(node: Node, options?: Object): Node {
        options = Object.assign({}, options, {type: 'map'});
        let loopNode;
        switch (options.type) {
            case 'map':
                loopNode = new MapLoop(node);
                break;
            default:
                throw new Error(`Unknow loop type ${options.type}`);
        }
        addNodeToGraph(loopNode, this);
        this.emit('change');
        return loopNode;
    }

    deleteNode(node: Node): void {
        if (!this._nodes.has(node)) {
            throw new Error('node not found in pipeline');
        }
        this._nodes.delete(node);
        this.graph.destroyExistingVertex(node.id);
        this.emit('change');
    }

    async _run() {
        const nodesToRun = Array.from(this.graph.transitiveReduction().vertices_topologically()).map(mapNode);
        for (const linkedInput of this.linkedInputs.values()) {
            linkedInput.output.setValue(linkedInput.input.getValue());
        }
        await this.schedule(nodesToRun);
        for (const linkedOutput of this.linkedOutputs.values()) {
            linkedOutput.output.setValue(linkedOutput.input.getValue());
        }
    }

    async runNode(node: string|Node) {
        if (typeof node === 'string') node = this.getNode(node);
        if (!node) throw new Error(`node not found: ${node}`);
        const nodesToRun: Array<Node> = [node];
        const addParents = (node) => {
            for (const [, parent] of this.graph.verticesTo(node.id)) {
                if (parent instanceof Node) {
                    if (nodesToRun.includes(parent)) nodesToRun.splice(nodesToRun.indexOf(parent), 1);
                    nodesToRun.unshift(parent);
                }
                addParents(parent);
            }
        };

        addParents(node);
        await this.schedule(nodesToRun);
    }

    _canRun() {
        return true;
    }

    _computeStatus(): NodeStatus {
        return READY;
    }

    reset(): void {
        super.reset();
        for (let node of this._nodes) {
            node.reset();
        }
        // todo implement pipeline reset
    }

    async schedule(nodeList: Array<Node>) {
        const erroredNodes: Map<string, Error> = new Map();
        main: for (const node of nodeList) {
            for (const errored of erroredNodes) {
                if (this.graph.hasPath(errored, node.id)) {
                    continue main;
                }
            }
            try {
                for (const input of node.inputs.values()) {
                    if (!input.hasValue()) {
                        if (input.isMultiple()) {
                            const value = [];
                            for (const output of this.getConnectedOutputs(input)) {
                                value.push(output.getValue());
                            }
                            input.setValue(value);
                        } else {
                            const output = this.getConnectedOutputs(input)[0];
                            input.setValue(output.getValue());
                        }
                    }
                }
                await node.run();
                for (const [, output] of node.outputs) {
                    const linkedOutput = this.linkedOutputs.get(output.id);
                    if (linkedOutput) {
                        linkedOutput.input.setValue(output.getValue());
                    }
                }
            } catch (e) {
                this.emit('runError', e);
                erroredNodes.set(node.id, e);
            }
        }
        if (erroredNodes.size > 0) {
            const errors = [];
            for (const error of erroredNodes.values()) {
                errors.push(error.message);
            }
            throw new Error(`Errors occured in pipeline: [${errors.join(', ')}]`);
        }
    }

    getConnectedOutputs(input: InputPort): Array<OutputPort> {
        const result = [];
        const linkedInput = this.linkedInputs.get(input.id);
        if (linkedInput) {
            result.push(linkedInput.output);
        }

        const nodeId = input.node.id;
        const parentNodes: Array<string> = Array.from(this.graph.verticesTo(nodeId)).map(mapId);
        for (const parentId of parentNodes) {
            const graphEdge: GraphEdge = this.graph.edgeValue(parentId, nodeId);
            for (const connection of graphEdge.connections) {
                const [outputId, inputId] = connection.split(':');
                if (inputId === input.id) {
                    const [, , outputType] = outputId.split('_');
                    result.push(graphEdge.from.output(outputType));
                }
            }
        }
        return result;
    }

    getConnectedInputs(output: OutputPort): Array<InputPort> {
        const result = [];
        const linkedOutput = this.linkedOutputs.get(output.id);
        if (linkedOutput) {
            result.push(linkedOutput.input);
        }

        const nodeId = output.node.id;
        const childNodes: Array<string> = Array.from(this.graph.verticesFrom(nodeId)).map(mapId);
        for (const childId of childNodes) {
            const graphEdge: GraphEdge = this.graph.edgeValue(nodeId, childId);
            for (const connection of graphEdge.connections) {
                const [outputId, inputId] = connection.split(':');
                if (outputId === output.id) {
                    const [, , inputType] = inputId.split('_');
                    result.push(graphEdge.to.input(inputType));
                }
            }
        }
        return result;
    }

    linkInput(input: InputPort, configOrName: string | Object) {
        const config = getConfig(configOrName);
        if (config.default && this.defaultInput) {
            throw new Error('cannot have more than one default input');
        }

        const newInput = new InputPort(this, config);
        const newOutput = new OutputPort(this, config);
        const link = new LinkedPort(newInput, newOutput, config.name);
        this.inputs.set(config.name, newInput);
        this.linkedInputs.set(input.id, link);

        if (config.default) {
            this.defaultInput = newInput;
        }
        this.emit('change');
    }

    linkOutput(output: OutputPort, configOrName: string) {
        const config = getConfig(configOrName);
        if (config.default && this.defaultOutput) {
            throw new Error('cannot have more than one default output');
        }

        const newInput = new InputPort(this, config);
        const newOutput = new OutputPort(this, config);
        const link = new LinkedPort(newInput, newOutput, config.name);
        this.outputs.set(config.name, newOutput);
        this.linkedOutputs.set(output.id, link);

        if (config.default) {
            this.defaultOutput = newOutput;
        }
        this.emit('change');
    }

    toJSON() {
        return {
            kind: this.kind,
            id: this.id,
            inputs: inputsToArray(this.inputs, this.linkedInputs),
            outputs: outputsToArray(this.outputs, this.linkedOutputs),
            graph: this.graph.toJSON(),
            title: this.title
        };
    }

    loadJSON(json: Object, idSuffix: string) {
        this.title = json.title;
        const graph = Graph.fromJSON(json.graph);
        for (const [, node] of graph.vertices()) {
            if (node.kind === 'block') {
                const newNode = this.newNode(node.type, node.options, node.id + idSuffix);
                newNode.title = node.title;
            } else if (node.kind === 'pipeline') {
                const pipeline = this.env.newPipeline(node.id + idSuffix);
                pipeline.loadJSON(node, idSuffix);
                this.addNode(pipeline);
            } else {
                throw new Error('unimplemented load JSON for ' + node.kind);
            }
        }
        for (const [fromId, toId, edgeValue] of graph.edges()) {
            const fromNode = this.findNode(fromId + idSuffix);
            const toNode = this.findNode(toId + idSuffix);
            if (!fromNode || !toNode) {
                throw new Error('unreachable');
            }
            const split = edgeValue[0].split(':').map((x) => x.split('_'));
            this.connect(fromNode.output(split[0][2]), toNode.input(split[1][2]));
        }

        if (json.inputs) {
            for (const input of json.inputs) {
                const node = this.findNode(input.link.id + idSuffix);
                this.linkInput(node.input(input.link.name), input);
            }
        }
        if (json.outputs) {
            for (const output of json.outputs) {
                const node = this.findNode(output.link.id + idSuffix);
                this.linkOutput(node.output(output.link.name), output);
            }
        }
    }

    resetChildren(node: Node) {
        for (const [, otherNode] of this.graph.verticesFrom(node.id)) {
            otherNode.reset();
        }
    }
}

function getConfig(configOrName: string | Object): Object {
    let config: Object;
    if (typeof configOrName === 'string') {
        config = {name: configOrName};
    } else {
        if (!configOrName.name) {
            throw new Error('port config must have a name');
        }
        config = configOrName;
    }
    return config;
}

function addNodeToGraph(node: Node, self: Pipeline) {
    node.on('status', status => {
        if (status === INSTANTIATED || status === READY) {
            self.computeStatus();
            self.resetChildren(node);
        }
        self.emit('child-status', status, node);
    });
    node.on('change', () => {
        self.emit('child-change', node);
        self.emit('deep-child-change', node);
    });
    if (node.kind === 'pipeline') {
        node.on('deep-child-change', (node) => {
            self.emit('deep-child-change', node);
        });
    }

    self._nodes.add(node);
    self.graph.addNewVertex(node.id, node);
}

function mapNode([, node]) {
    return node;
}

function mapId([id]) {
    return id;
}

function inputsToArray(ports: Map<string, InputPort>, linkedInputs: Map<string, LinkedPort>): Array<Object> {
    const arr = [];
    for (let port of ports.values()) {
        const obj = {
            id: port.id,
            name: port.name,
            multiple: port.multiple,
            required: port.required
        };
        for (let [linkId, linkValue] of linkedInputs) {
            if (linkValue.input.id === port.id) {
                const split = linkId.split('_');
                obj.link = {
                    id: split[0],
                    name: split[2]
                };
            }
        }
        arr.push(obj);
    }
    return arr;
}

function outputsToArray(ports: Map<string, OutputPort>, linkedOutputs: Map<string, LinkedPort>): Array<Object> {
    const arr = [];
    for (let port of ports.values()) {
        const obj = {
            id: port.id,
            name: port.name,
        };
        for (let [linkId, linkValue] of linkedOutputs) {
            if (linkValue.output.id === port.id) {
                const split = linkId.split('_');
                obj.link = {
                    id: split[0],
                    name: split[2]
                };
            }
        }
        arr.push(obj);
    }
    return arr;
}
