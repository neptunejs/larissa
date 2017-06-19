// @flow

import type Input from './InputPort';
import type Node from './Node';
import type Output from './OutputPort';

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

    removeConnection(output: Output, input: Input) {
        const connectionId = output.id + ':' + input.id;
        if (!this.connections.has(connectionId)) {
            throw new Error(`no connection found between ${output.id} and ${input.id}`);
        }
        this.connections.delete(connectionId);
    }

    hasConnections(): boolean {
        return this.connections.size > 0;
    }

    toJSON() {
        return Array.from(this.connections);
    }
}
