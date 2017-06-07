// @flow
import type Context from '../../BlockContext';

// Random number generator
export default {
    name: 'rng',
    outputs: [
        {name: 'number', type: 'number'}
    ],
    executor: (ctx: Context) => {
        ctx.setOutput('number', Math.random());
    }
};
