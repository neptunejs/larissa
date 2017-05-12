import {BlockType} from '../src/BlockTypes';
import Block from '../src/Block';

export async function checkBlock(blockDefinition, inputs, outputs, options) {
    const blockType = new BlockType(blockDefinition);
    const block = new Block(blockType, options);
    if (typeof inputs === 'object') {
        for (const i in inputs) {
            block.input(i).setValue(inputs[i]);
        }
    } else {
        block.input().setValue(inputs);
    }
    await block.run();
    if (typeof outputs === 'object') {
        for (const i in outputs) {
            expect(block.output(i).getValue()).toEqual(outputs[i]);
        }
    } else {
        expect(block.output().getValue()).toEqual(outputs);
    }
}
