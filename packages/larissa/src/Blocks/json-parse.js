// @flow
import type Context from '../BlockContext';

export default {
    name: 'json-parse',
    outputs: [
        {
            name: 'parsed'
        }
    ],
    inputs: [
        {
            name: 'json',
            type: 'string',
            multiple: false
        }
    ],
    executor: setOutput
};

async function setOutput(ctx: Context) {
    ctx.setOutput('parsed', JSON.parse(ctx.getInput('json')));
}
