// @flow
import type Context from '../BlockContext';

export default {
    name: 'column-filter',
    inputs: [
        {name: 'table', type: 'table'}
    ],
    outputs: [
        {name: 'filtered', type: 'matrix'}
    ],
    options: {
        type: 'object',
        properties: {
            columns: {
                type: 'array',
                label: 'Columns',
                items: {
                    type: 'string'
                }
            }
        }
    },
    executor: filter
};

async function filter(ctx: Context) {
    const table = ctx.getInput('table');
    const options = ctx.getOptions();
    if (!options.columns || options.columns.length === 0) throw new Error('there must be at least one column');
    const indexes = [];
    for (const column of options.columns) {
        const index = table.headers.indexOf(column);
        if (index === -1) {
            throw new Error(`Column ${column} not found`);
        }
        indexes.push(index);
    }
    const filtered = [];
    for (var row = 0; row < table.data.length; row++) {
        const value = table.data[row];
        const newValue = [];
        for (const index of indexes) {
            newValue.push(value[index]);
        }
        filtered.push(newValue);
    }
    ctx.setOutput('filtered', filtered);
}
