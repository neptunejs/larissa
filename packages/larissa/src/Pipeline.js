// @flow

import Node from './Node';

export default class Pipeline {
    addNode(type: string, options: Object): Node {
        return new Node();
    }

    executeNode(node: Node) {

    }

    executeAll() {

    }

    clean() {

    }
}