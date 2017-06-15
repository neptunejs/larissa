// @flow
import type Context from '../BlockContext';

export default {
    name: 'boolean',
    outputs: [
        {name: 'boolean', type: 'boolean'}
    ],
    options: {
        type: 'object',
        properties: {
            value: {
                type: 'boolean',
                required: true,
                default: false
            }
        }
    },
    executor: setOutput
};

async function setOutput(ctx: Context) {
    ctx.setOutput('boolean', ctx.getOptions().value);
}
