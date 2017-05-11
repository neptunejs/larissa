// @flow
import Graph from 'graph.js/dist/graph.full';

import Block from './Block';
import Node, {FINISHED, RUNNING} from './Node';
import builtInBlocks from './Blocks/Blocks';

import type Environment from './Environment';
import type Input from './Input';
import type Output from './Output';

export default class Pipeline extends Node {
    env: Environment;
    graph: Graph;
    nodes: WeakSet<Node>;

    constructor(env: Environment) {
        super();
        this.env = env;
        this.graph = new Graph();
        this.nodes = new WeakSet();
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

    newNode(identifier: string, options?: Object): Node {
        let [plugin, name] = identifier.split('/');
        if (name === undefined) {
            name = plugin;
            plugin = undefined;
        }
        let blockType;
        if (typeof plugin === 'string') {
            blockType = this.env.getPlugin(plugin).getBlockType(name);
        } else {
            blockType = builtInBlocks.getBlock(name);
            if (blockType === undefined) {
                throw new Error(`no such builtin block: ${name}`);
            }
        }
        const node = new Block(blockType, options);
        this.nodes.add(node);
        this.graph.addNewVertex(node.id, node);
        for (const input of node.inputs.values()) {
            this.graph.addNewVertex(input.id, input);
            this.graph.addNewEdge(input.id, node.id);
        }
        for (const output of node.outputs.values()) {
            this.graph.addNewVertex(output.id, output);
            this.graph.addNewEdge(node.id, output.id);
        }
        // Todo for each input and output of this node, create a vertex and connect with the node
        return node;
    }

    removeNode(node: Node): void {
        if (!this.nodes.has(node)) {
            throw new Error('node not found in pipeline');
        }
        this.nodes.delete(node);
        this.graph.removeExistingVertex(node.id);
        // Todo for each input and output of this node, remove corresponding vertices
    }

    async runNode() {

    }

    async run() {
        this.runCheck();
        if (this.status === FINISHED) return null;
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
        return this.schedule(nodesToRun);
    }

    reset(): void {

    }

    async schedule(nodeList: Array<Node>) {
        this.status = RUNNING;
        for (const node of nodeList) {
            if (node.status === FINISHED) {
                continue;
            }
            for (const input of node.inputs.values()) {
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
            await node.run();
        }
        this.status = FINISHED;
    }

    getConnectedOutputs(input: Input): Array<Output> {
        return Array.from(this.graph.verticesTo(input.id)).map(([, output]) => output);
    }

    getConnectedInputs(output: Output): Array<Input> {
        return Array.from(this.graph.verticesFrom(output.id)).map(([, input]) => input);
    }

    toJSON() {
        return {
            kind: 'pipeline',
            graph: this.graph.toJSON()
        };
    }
}
