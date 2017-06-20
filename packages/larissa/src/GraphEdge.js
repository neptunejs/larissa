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
            throw new Error(`there is already a connection between ${output.id} and ${input.id}`);
        }
        this.connections.add(connectionId);
    }

    hasConnection(output: Output, input: Input) {
        const connectionId = output.id + ':' + input.id;
        return this.connections.has(connectionId);
    }

    removeConnection(output: Output, input: Input) {
        const connectionId = output.id + ':' + input.id;
        if (!this.connections.has(connectionId)) {
            throw new Error(`no connection found between ${output.id} and ${input.id}`);
        }
        this.connections.delete(connectionId);
    }

    removeConnectionsFrom(output: Output) {
        for (let connection of this.connectionsFrom(output)) {
            this.connections.delete(connection);
        }
    }

    removeConnectionsTo(input: Input) {
        for (let connection of this.connectionsTo(input)) {
            this.connections.delete(connection);
        }
    }

    removeConnections() {
        this.connections.clear();
    }

    hasConnections(): boolean {
        return this.connections.size > 0;
    }

    hasConnectionsFrom(output: Output) {
        const connections = [...this.connectionsFrom(output)];
        return !!connections.length;
    }

    hasConnectionsTo(input: Input) {
        const connections = [...this.connectionsTo(input)];
        return !!connections.length;
    }

    *connectionsFrom(output: Output): Iterator<string> {
        for (let connection of this.connections) {
            if (connection.startsWith(output.id)) {
                yield connection;
            }
        }
    }

    *connectionsTo(input: Input): Iterator<string> {
        for (let connection of this.connections) {
            if (connection.endsWith(input.id)) {
                yield connection;
            }
        }
    }

    toJSON() {
        return Array.from(this.connections);
    }
}
