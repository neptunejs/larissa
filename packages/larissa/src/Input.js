// @flow
import Port from './Port';
import type Node from './Node';

export default class Input extends Port {
    multiple: boolean;
    required: boolean;

    constructor(node: Node, options: Object) {
        super(node, options);

        this.required = !!options.required;
        this.multiple = false;
    }

    getDirection() {
        return 'input';
    }

    isMultiple(): boolean {
        return this.multiple;
    }

    isRequired(): boolean {
        return this.required;
    }
}
