// @flow
import Graph from 'graph.js/dist/graph.full';

import Node from './Node';

export default class Pipeline {
    graph: Graph;

    constructor() {
        this.graph = new Graph();
    }

    connect() {

    }

    newNode(): Node {
        return new Node();
    }

    async runNode() {

    }

    async run() {

    }

    reset(): void {

    }
}
