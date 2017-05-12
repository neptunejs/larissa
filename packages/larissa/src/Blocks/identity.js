// @flow
import type Context from '../BlockContext';

export default {
    name: 'identity',
    inputs: [
        {name: 'value'}
    ],
    outputs: [
        {name: 'value'}
    ],
    executor: (ctx: Context) => {
        ctx.setOutput('value', ctx.getInput('value'));
    }
};
