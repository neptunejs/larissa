// @flow
import Node from './Node';
import type Input from './Input';
import type Output from './Output';

export default class Pipeline {
    connect(output: Output, input: Input) {

    }

    addNode(type: string, options: ?Object): Node {
        return new Node();
    }

    async executeNode(node: Node) {

    }

    async executeAll() {

    }

    reset(): void {

    }
}
