// @flow
import Graph from 'graph.js/dist/graph.full';

import Block from './Block';
import GraphEdge from './GraphEdge';
import MapLoop from './MapLoop';
import Node, {INSTANTIATED} from './Node';
import LinkedPort from './LinkedPort';

import InputPort from './InputPort';
import OutputPort from './OutputPort';

import type Environment from './Environment';

export default class Pipeline extends Node {
    env: Environment;
    graph: Graph;
    nodes: Set<Node>;
    linkedInputs: Map<string, LinkedPort>;
    linkedOutputs: Map<string, LinkedPort>;

    constructor(env: Environment) {
        super();
        this.env = env;
        this.graph = new Graph();
        this.nodes = new Set();
        this.title = 'Pipeline';
        this.linkedInputs = new Map();
        this.linkedOutputs = new Map();
    }

    get kind(): string {
        return 'pipeline';
    }

    findNode(nodeId: string) {
        if (this.id === nodeId) return this;
        for (let node of this.nodes) {
            if (node.id === nodeId) return node;
            if (node instanceof Pipeline) {
                const subNode = node.findNode(nodeId);
                if (subNode) return subNode;
            }
        }
        return null;
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

        if (!this.nodes.has(outputNode)) {
            throw new Error(`output node ${outputNode.id} not found in pipeline`);
        }
        if (!this.nodes.has(inputNode)) {
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
    }

    getNode(id: string): Node | null {
        for (let node of this.nodes) {
            if (node.id === id) {
                return node;
            }
        }
        return null;
    }

    addNode(node: Node): void {
        if (this.nodes.has(node)) {
            throw new Error('node is already in pipeline');
        }
        addNodeToGraph(node, this);
    }

    newNode(identifier: string, options?: Object): Node {
        const blockType = this.env.getBlock(identifier);
        const node = new Block(blockType, options);
        addNodeToGraph(node, this);
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
        return loopNode;
    }

    deleteNode(node: Node): void {
        if (!this.nodes.has(node)) {
            throw new Error('node not found in pipeline');
        }
        this.nodes.delete(node);
        this.graph.destroyExistingVertex(node.id);
    }

    async run() {
        this.status = INSTANTIATED;
        await super.run();
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

    _canRun() {
        return true;
    }

    reset(): void {
        super.reset();
        for (let node of this.nodes) {
            node.reset();
        }
        // todo implement pipeline reset
    }

    async schedule(nodeList: Array<Node>) {
        const erroredNodes: Set<string> = new Set();
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
                erroredNodes.add(node.id);
            }
        }
        if (erroredNodes.size > 0) {
            throw new Error('Error occured in pipeline');
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
    }

    toJSON() {
        return {
            kind: this.kind,
            status: this.status,
            id: this.id,
            inputs: inputsToArray(this.inputs),
            outputs: outputsToArray(this.outputs),
            graph: this.graph.toJSON(),
            title: this.title
        };
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
        if (status === INSTANTIATED) {
            self.status = INSTANTIATED;
        }
        self.emit('child-status', status, node);
    });
    self.nodes.add(node);
    self.graph.addNewVertex(node.id, node);
}

function mapNode([, node]) {
    return node;
}

function mapId([id]) {
    return id;
}

function inputsToArray(ports: Map<string, InputPort>): Array<Object> {
    const arr = [];
    for (let port of ports.values()) {
        var obj = {
            id: port.id,
            name: port.name,
            multiple: port.multiple,
            required: port.required
        };
        arr.push(obj);
    }
    return arr;
}

function outputsToArray(ports: Map<string, OutputPort>): Array<Object> {
    const arr = [];
    for (let port of ports.values()) {
        var obj = {
            id: port.id,
            name: port.name,
        };
        arr.push(obj);
    }
    return arr;
}
