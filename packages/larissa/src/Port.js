// @flow

import type Node from './Node';

export default class Port {
    id: string;
    name: string;
    node: Node;

    constructor(node: Node, options: Object) {
        this.id = options.name;
        this.name = options.name;
        this.node = node;
    }
}
