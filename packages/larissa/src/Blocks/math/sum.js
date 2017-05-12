// @flow
import type Context from '../../BlockContext';

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
    executor: computeSum
};

async function computeSum(ctx: Context) {
    const numbers: Array<number> = ctx.getInput('value');
    ctx.setOutput('sum', numbers.reduce((prev, current) => prev + current, 0));
}
