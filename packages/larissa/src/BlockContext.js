// @flow
import type Block from './Block';

export default class BlockContext {
    block: Block;
    constructor(block: Block) {
        this.block = block;
    }

    getOptions(): Object {
        if (!this.block.options) {
            throw new Error('missing options');
        }
        return this.block.options;
    }

    getInput(name: string): any {
        return this.block.input(name).getValue();
    }

    setOutput(name: string, value: mixed): void {
        this.block.output(name).setValue(value);
    }
}
