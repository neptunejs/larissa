import Block from '../src/Block';
import Env from '../src/Environment';

const env = new Env();

export async function checkBlock(type, inputs, outputs, options) {
    const block = createBlock(type, options);
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

export function getBlockType(type) {
    return env.getBlock(type);
}

export function createBlock(type, options) {
    return new Block(getBlockType(type), options);
}