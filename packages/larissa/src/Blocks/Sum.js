// @flow

import type {Context} from '../Block';

// A very simple block that takes several numbers as input and outputs their sum
export default {
    name: 'sum',
    inputs: [
        {
            name: 'value',
            multiple: true,
            type: 'number'
        }
    ],
    outputs: [
        {
            name: 'sum',
            type: 'number'
        }
    ],
    options: null,
    executor: computeSum
};

async function computeSum(ctx: Context) {
    const numbers: Array<number> = ctx.getInput('value');
    return numbers.reduce((prev, current) => prev + current, 0);
}
