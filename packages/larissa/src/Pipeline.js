// @flow
import Graph from 'graph.js/dist/graph.full';

import Block from './Block';
import Node, {INSTANTIATED} from './Node';
import MapLoop from './MapLoop';
import builtInBlocks from './Blocks/Blocks';

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

    connect(nodeOutput: Node | Output, nodeInput: Node | Input) {
        if (nodeOutput instanceof Node) {
            nodeOutput = nodeOutput.output();
        }
        if (nodeInput instanceof Node) {
            nodeInput = nodeInput.input();
        }
        if (!this.nodes.has(nodeOutput.node)) {
            throw new Error('output node not found in pipeline');
        }
        if (!this.nodes.has(nodeInput.node)) {
            throw new Error('input node not found in pipeline');
        }
        // TODO: find single type match between node1 outputs and node2 inputs ?
        // TODO: or additional arguments to specify the input and output names
        // TODO: check that the types of node1's output is compatible with node2's input
        // TODO: check if the connection already exists and if so throw
        // How are inputs and outputs defined for a Pipeline ?
        this.graph.addNewEdge(nodeOutput.id, nodeInput.id);
        if (this.graph.hasCycle()) {
            this.graph.removeExistingEdge(nodeOutput.id, nodeInput.id);
            throw new Error(`cannot connect nodes ${nodeOutput.id} and ${nodeInput.id} because of cycle`);
        }
    }

    addNode(node: Node): void {
        if (this.nodes.has(node)) {
            throw new Error('node is already in pipeline');
        }
        this.nodes.add(node);
        addNodeToGraph(node, this);
    }

    newNode(identifier: string, options?: Object): Node {
        const blockType = this.env.getBlock(identifier);
        const node = new Block(blockType, options);
        this.nodes.add(node);
        addNodeToGraph(node, this);
        // Todo for each input and output of this node, create a vertex and connect with the node
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
        this.nodes.add(loopNode);
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
        const self = this;
        const endNodes: Array<Node> = Array.from(this.graph.sinks()).map(a => a[1]); // grab endNodes
        const nodesToRun = endNodes.filter(node => node instanceof Node);
        for (const node of endNodes) {
            addParents(node);
        }
        function addParents(node) {
            for (const [, parent] of self.graph.verticesTo(node.id)) {
                if (parent instanceof Node) {
                    if (nodesToRun.includes(parent)) nodesToRun.splice(nodesToRun.indexOf(parent), 1);
                    nodesToRun.unshift(parent);
                }
                addParents(parent);
            }
        }

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
        return Array.from(this.graph.verticesTo(input.id)).map(([, output]) => output);
    }

    getConnectedInputs(output: Output): Array<Input> {
        return Array.from(this.graph.verticesFrom(output.id)).map(([, input]) => input);
    }

    linkInput(input: Input, configOrName: string | Object) {
        const config = getConfig(configOrName);
        const id = this.newNode('identity');
        const newInput = id.input();
        newInput.node = this;
        this.inputs.set(config.name, newInput);
        if (config.default) {
            if (this.defaultInput) {
                throw new Error('cannot have more than one default input');
            }
            this.defaultInput = newInput;
        }
        this.connect(id, input);
    }

    linkOutput(output: Output, configOrName: string) {
        const config = getConfig(configOrName);
        const id = this.newNode('identity');
        const newOutput = id.output();
        newOutput.node = this;
        this.outputs.set(config.name, newOutput);
        if (config.default) {
            if (this.defaultOutput) {
                throw new Error('cannot have more than one default output');
            }
            this.defaultOutput = newOutput;
        }
        this.connect(output, id);
    }

    toJSON() {
        return {
            kind: 'pipeline',
            graph: this.graph.toJSON()
        };
    }

    inspect() {
        return {
            kind: 'pipeline',
            id: this.id
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
    self.graph.addNewVertex(node.id, node);
    for (const input of node.inputs.values()) {
        self.graph.addNewVertex(input.id, input);
        self.graph.addNewEdge(input.id, node.id);
    }
    for (const output of node.outputs.values()) {
        self.graph.addNewVertex(output.id, output);
        self.graph.addNewEdge(node.id, output.id);
    }
}
