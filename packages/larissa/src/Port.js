// @flow

import type Node from './Node';

export default class Port {
    id: string;
    name: string;
    node: Node;
    type: string;

    constructor(node: Node, options: Object) {
        this.id = `${node.id}_${this.getDirection()}_${options.name}`;
        this.name = options.name;
        this.node = node;
    }

    getDirection(): string {
        throw new Error('implement me!');
    }
}
