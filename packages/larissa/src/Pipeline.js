// @flow
import Graph from 'graph.js/dist/graph.full';

import Block from './Block';
import Node from './Node';

import type Environment from './Environment';

export default class Pipeline extends Node {
    env: Environment;
    graph: Graph;

    constructor(env: Environment) {
        super();
        this.env = env;
        this.graph = new Graph();
    }

    connect(node1: Node, node2: Node) {
        this.graph.addEdge(node1.id, node2.id, {
            edge: 'test'
        });
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
            // TODO grab blockType from built-ins
        }
        const node = new Block(blockType, options);
        this.graph.addVertex(node.id, node);
        return node;
    }

    async runNode() {

    }

    async run() {

    }

    reset(): void {

    }
}
