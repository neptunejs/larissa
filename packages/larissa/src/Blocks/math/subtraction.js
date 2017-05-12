// @flow
import type Context from '../../BlockContext';

export default {
    name: 'subtraction',
    inputs: [
        {
            name: 'minuend',
            type: 'number'
        },
        {
            name: 'subtrahend',
            type: 'number'
        }
    ],
    outputs: [
        {
            name: 'subtraction',
            type: 'number'
        }
    ],
    executor: (ctx: Context) => {
        const minuend: number = ctx.getInput('minuend');
        const subtrahend: number = ctx.getInput('subtrahend');
        ctx.setOutput('division', minuend - subtrahend);
    }
};
