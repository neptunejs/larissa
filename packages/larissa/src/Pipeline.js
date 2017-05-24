// @flow
import Graph from 'graph.js/dist/graph.full';

import Block from './Block';
import GraphEdge from './GraphEdge';
import MapLoop from './MapLoop';
import Node, {INSTANTIATED} from './Node';

import type Input from './Input';
import type Output from './Output';

import type Environment from './Environment';

export default class Pipeline extends Node {
    env: Environment;
    graph: Graph;
    nodes: Set<Node>;

    constructor(env: Environment) {
        super();
        this.env = env;
        this.graph = new Graph();
        this.nodes = new Set();
    }

    get kind(): string {
        return 'pipeline';
    }

    connect(nodeOutput: Node | Output, nodeInput: Node | Input) {
        if (nodeOutput instanceof Node) {
            nodeOutput = nodeOutput.output();
        }
        if (nodeInput instanceof Node) {
            nodeInput = nodeInput.input();
        }
        if (!this.nodes.has(nodeOutput.node)) {
            throw new Error(`output node ${nodeOutput.node.id} not found in pipeline`);
        }
        if (!this.nodes.has(nodeInput.node)) {
            throw new Error(`input node ${nodeInput.node.id} not found in pipeline`);
        }
        // TODO: find single type match between node1 outputs and node2 inputs ?
        // TODO: check that the types of node1's output is compatible with node2's input
        let edge: GraphEdge;
        if (this.graph.hasEdge(nodeOutput.node.id, nodeInput.node.id)) {
            edge = this.graph.edgeValue(nodeOutput.node.id, nodeInput.node.id);
        } else {
            edge = new GraphEdge(nodeOutput.node, nodeInput.node);
            this.graph.addNewEdge(nodeOutput.node.id, nodeInput.node.id, edge);
            if (this.graph.hasCycle()) {
                this.graph.removeExistingEdge(nodeOutput.node.id, nodeInput.node.id);
                throw new Error(`cannot connect nodes ${nodeOutput.node.id} and ${nodeInput.node.id} because of cycle`);
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

    removeNode(node: Node): void {
        if (!this.nodes.has(node)) {
            throw new Error('node not found in pipeline');
        }
        this.nodes.delete(node);
        this.graph.removeExistingVertex(node.id);
        // Todo for each input and output of this node, remove corresponding vertices
    }

    async run() {
        this.status = INSTANTIATED;
        await super.run();
    }

    async _run() {
        const nodesToRun = Array.from(this.graph.transitiveReduction().vertices_topologically()).map(mapNode);
        await this.schedule(nodesToRun);
    }

    reset(): void {
        super.reset();
        for (let node of this.nodes) {
            node.reset();
        }
        // todo implement pipeline reset
    }

    async schedule(nodeList: Array<Node>) {
        for (const node of nodeList) {
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
        }
    }

    getConnectedOutputs(input: Input): Array<Output> {
        const nodeId = input.node.id;
        const parentNodes: Array<string> = Array.from(this.graph.verticesTo(nodeId)).map(mapId);
        const result = [];
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

    getConnectedInputs(output: Output): Array<Input> {
        const nodeId = output.node.id;
        const childNodes: Array<string> = Array.from(this.graph.verticesFrom(nodeId)).map(mapId);
        const result = [];
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

    linkInput(input: Input, configOrName: string | Object) {
        const config = getConfig(configOrName);
        if (config.default && this.defaultInput) {
            throw new Error('cannot have more than one default input');
        }
        const id = this.newNode('identity');
        const newInput = id.input();
        newInput.node = this;
        this.inputs.set(config.name, newInput);
        newInput.id = newInput.id.replace(/_[a-z]+$/, '_' + config.name);
        if (config.default) {
            this.defaultInput = newInput;
        }
        this.connect(id, input);
    }

    linkOutput(output: Output, configOrName: string) {
        const config = getConfig(configOrName);
        if (config.default && this.defaultOutput) {
            throw new Error('cannot have more than one default output');
        }
        const id = this.newNode('identity');
        const newOutput = id.output();
        newOutput.node = this;
        this.outputs.set(config.name, newOutput);
        newOutput.id = newOutput.id.replace(/_[a-z]+$/, '_' + config.name);
        if (config.default) {
            this.defaultOutput = newOutput;
        }
        this.connect(output, id);
    }

    toJSON() {
        return {
            kind: this.kind,
            graph: this.graph.toJSON()
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
