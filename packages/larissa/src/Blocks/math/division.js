// @flow
import type Context from '../../BlockContext';

export default {
    name: 'division',
    inputs: [
        {
            name: 'dividend',
            type: 'number'
        },
        {
            name: 'divisor',
            type: 'number'
        }
    ],
    outputs: [
        {
            name: 'division',
            type: 'number'
        }
    ],
    executor: (ctx: Context) => {
        const dividend: number = ctx.getInput('dividend');
        const divisor: number = ctx.getInput('divisor');
        const result = dividend / divisor;
        if (Number.isNaN(result)) {
            throw new Error('division failed');
        }
        ctx.setOutput('division', result);
    }
};
