// @flow
import type Context from '../BlockContext';
import PapaParse from 'papaparse';

export default {
    name: 'csv-parse',
    outputs: [
        {
            name: 'parsed', type: 'table'
        }
    ],
    inputs: [
        {
            name: 'csv',
            type: 'string',
            multiple: false,
            required: true
        }
    ],
    options: {
        type: 'object',
        properties: {
            delimiter: {
                type: 'string',
                required: false,
                default: '' // autodetect
            },
            newline: {
                type: 'string',
                required: false,
                default: '' // autodetect
            },
            header: {
                type: 'boolean',
                required: false,
                default: false
            }
        }
    },
    executor: setOutput
};

async function setOutput(ctx: Context) {
    const parsed = PapaParse.parse(ctx.getInput('csv'), ctx.getOptions());
    ctx.setOutput('parsed', parsed);
}
