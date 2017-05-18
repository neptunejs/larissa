// @flow

import type Input from './Input';
import type Node from './Node';
import type Output from './Output';

export default class GraphEdge {
    from: Node;
    to: Node;
    connections: Set<string>;

    constructor(from: Node, to: Node) {
        this.from = from;
        this.to = to;
        this.connections = new Set();
    }

    addConnection(output: Output, input: Input) {
        const connectionId = output.id + ':' + input.id;
        if (this.connections.has(connectionId)) {
            throw new Error(`There is already a connection between ${output.id} and ${input.id}`);
        }
        this.connections.add(connectionId);
    }
    toJSON() {
        return Array.from(this.connections);
    }
}
