// @flow
import type Node from './Node';

export default class Port {
    id: string;
    name: string;
    node: Node;
    value: any;
    type: ?string;

    constructor(node: Node, options: Object) {
        this.id = `${node.id}_${this.getDirection()}_${options.name}`;
        this.name = options.name;
        this.node = node;
        this.value = undefined;
        this.type = options.type || null;
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

    getType(): ?string {
        return this.type;
    }

    getDirection(): string {
        throw new Error('implement me!');
    }

    toJSON(): Object {
        // Don't return node to avoid circularity
        return {
            id: this.id,
            name: this.name,
            type: this.type
        };
    }

    reset() {
        this.value = undefined;
    }
}
