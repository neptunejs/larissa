// @flow
import type Context from '../BlockContext';
import fetch from './executors/request';

export default {
    name: 'request',
    inputs: [
        {name: 'url', type: 'string'}
    ],
    outputs: [
        {name: 'data', type: 'string'}
    ],
    executor: setOutput
};

async function setOutput(ctx: Context) {
    ctx.setOutput('data', await fetch(ctx.getInput('url')));
}
