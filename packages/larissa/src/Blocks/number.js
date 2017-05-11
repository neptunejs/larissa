// @flow
import type Context from '../BlockContext';

export default {
    name: 'number',
    outputs: [
        {name: 'number'}
    ],
    options: {
        type: 'object',
        properties: {
            value: {
                type: 'number',
                required: true
            }
        }
    },
    executor: setOutput
};

async function setOutput(ctx: Context) {
    ctx.setOutput('number', ctx.getOptions().value);
}
