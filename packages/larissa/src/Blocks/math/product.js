// @flow
import type Context from '../../BlockContext';

// A very simple block that takes several numbers as input and outputs their product
export default {
    name: 'product',
    inputs: [
        {
            name: 'value',
            multiple: true,
            type: 'number'
        }
    ],
    outputs: [
        {
            name: 'product',
            type: 'number'
        }
    ],
    executor: (ctx: Context) => {
        const numbers: Array<number> = ctx.getInput('value');
        ctx.setOutput('product', numbers.reduce((prev, current) => prev * current, 1));
    }
};
