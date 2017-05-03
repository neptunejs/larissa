// @flow
import Graph from 'graph.js/dist/graph.full';

import Block from './Block';
import Node from './Node';

import type Environment from './Environment';

export default class Pipeline {
    env: Environment;
    graph: Graph;

    constructor(env: Environment) {
        this.env = env;
        this.graph = new Graph();
    }

    connect() {

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
        return new Block(blockType, options);
    }

    async runNode() {

    }

    async run() {

    }

    reset(): void {

    }
}
