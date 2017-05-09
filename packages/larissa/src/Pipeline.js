// @flow
import Graph from 'graph.js/dist/graph.full';

import Block from './Block';
import Node, {FINISHED, RUNNING} from './Node';
import BuiltInBlocks from './Blocks/Blocks';

import type Environment from './Environment';
import type Input from './Input';
import type Output from './Output';

export default class Pipeline extends Node {
    env: Environment;
    graph: Graph;

    constructor(env: Environment) {
        super();
        this.env = env;
        this.graph = new Graph();
    }

    connect(node1: Node | Output, node2: Node | Input) {
        if (node1 instanceof Node) {
            node1 = node1.output();
        }
        if (node2 instanceof Node) {
            node2 = node2.input();
        }
    connect(node1: Node, node2: Node) {
        // TODO: find single type match between node1 outputs and node2 inputs ?
        // TODO: or additional arguments to specify the input and output names
        // TODO: check that the types of node1's output is compatible with node2's input
        // TODO: check if the connection already exists and if so remove edge
        // How are inputs and outputs defined for a Pipeline ?
        this.graph.addEdge(node1.id, node2.id);
        if (this.graph.hasCycle()) {
            this.graph.removeEdge(node1.id, node2.id);
            throw new Error(`cannot connect nodes ${node1.id} and ${node2.id} because of cycle`);
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
            blockType = BuiltInBlocks[name];
        }
        const node = new Block(blockType, options);
        this.graph.addVertex(node.id, node);
        // Todo for each input and output of this node, create a vertex and connect with the node
        return node;
    }

    async runNode() {

    }

    async run() {
        this.runCheck();
        if (this.status === FINISHED) return;
        const self = this;
        const endNodes: Array<Node> = Array.from(this.graph.sinks()).map(a => a[1]); // grab endNodes
        const nodesToRun = endNodes.slice();
        for (const node of endNodes) {
            addParents(node);
        }
        function addParents(node) {
            for (const [, parent] of self.graph.verticesTo(node.id)) {
                if (nodesToRun.includes(parent)) nodesToRun.splice(nodesToRun.indexOf(parent), 1);
                nodesToRun.unshift(parent);
                addParents(parent);
            }
        }
        await this.schedule(nodesToRun);
    }

    reset(): void {

    }

    async schedule(nodeList: Array<Node>) {
        this.status = RUNNING;
        for (const node of nodeList) {
            if (node.status === FINISHED) {
                continue;
            }
            // TODO get incoming nodes and their output values
            // then pass the values to run
            await node.run();
        }
    }
}
