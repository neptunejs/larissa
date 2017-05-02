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

    addNode(): Node {
        return new Node();
    }

    async executeNode() {

    }

    async executeAll() {

    }

    reset(): void {

    }
}
