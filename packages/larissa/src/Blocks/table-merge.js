// @flow
import type Context from '../BlockContext';

export default {
    name: 'table-merge',
    inputs: [
        {name: 'table', type: 'table', multiple: true}
    ],
    outputs: [
        {name: 'merged', type: 'table'}
    ],
    executor: merge
};

async function merge(ctx: Context) {
    const tables = ctx.getInput('table');
    const newTable = {
        headers: [],
        data: []
    };
    for (var i = 0; i < tables.length; i++) {
        const table = tables[i];
        newTable.headers.push(...table.headers);
        if (i === 0) {
            for (var j = 0; j < table.data.length; j++) {
                newTable.data.push([]);
            }
        }
        for (var k = 0; k < table.data.length; k++) {
            newTable.data[k].push(...table.data[k]);
        }
    }
    ctx.setOutput('merged', newTable);
}
