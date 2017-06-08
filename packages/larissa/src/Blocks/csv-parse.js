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
            dynamicTyping: {
                type: 'boolean',
                required: false,
                default: false
            },
            hasHeader: {
                type: 'boolean',
                required: false,
                default: false
            },
            skipEmptyLines: {
                type: 'boolean',
                required: false,
                default: true
            }
        }
    },
    executor: setOutput
};

async function setOutput(ctx: Context) {
    let options = ctx.getOptions();
    const parsed = PapaParse.parse(ctx.getInput('csv'), options);
    let data = parsed.data;
    let headers;
    if (options.hasHeader) {
        headers = parsed.data[0];
        data.splice(0, 1);
    } else {
        headers = data[0].map((val, idx) => `col${idx + 1}`);
    }
    ctx.setOutput('parsed', {data, headers: headers});
}
