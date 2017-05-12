// @flow
import type Node from './Node';

export default class Port {
    id: string;
    name: string;
    node: Node;
    type: string;
    value: any;

    constructor(node: Node, options: Object) {
        this.id = `${node.id}_${this.getDirection()}_${options.name}`;
        this.name = options.name;
        this.node = node;
        this.value = undefined;
    }

    getValue() {
        return this.value;
    }

    setValue(value: any) {
        this.value = value;
    }

    hasValue(): boolean {
        return this.value !== undefined;
    }

    getDirection(): string {
        throw new Error('implement me!');
    }

    toJSON() {
        return null;
    }

    reset() {
        this.value = undefined;
    }
}
