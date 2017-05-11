// @flow
import Node from './Node';

import type Input from './Input';
import type {BlockType} from './BlockTypes';

export default class Block extends Node {
    blockType: BlockType;
    options: ?Object;

    constructor(blockType: BlockType, options?: Object) {
        super();
        this.blockType = blockType;
        this.options = options;
    }

    async run(options: Object = {}) {
        const context = new Context(this, options);
        if (this.options && this.blockType.validator) {
            this.blockType.validator(this.options);
        }
        await this.blockType.executor(context);
    }
}

class Context {
    block: Block;
    constructor(block: Block) {
        this.block = block;
    }

    getOptions(): ?Object {
        return this.block.options;
    }

    getInput(name: string): any {
        return this.block.input(name).getValue();
    }

    setOutput(name: string, value: mixed): void {
        this.block.output(name).setValue(value);
    }
}

export type {Context};
