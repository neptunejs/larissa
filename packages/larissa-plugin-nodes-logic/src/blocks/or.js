export default {
    name: 'OR',
    inputs: [
        {name: 'boolean1'},
        {name: 'boolean2'},
    ],
    outputs: [
        {name: 'boolean'}
    ],
    options: null,
    executor: or
};

async function or(ctx) {
    const value1 = ctx.getInput('boolean1');
    const value2 = ctx.getInput('boolean2');
    ctx.setOutput('boolean', value1 || value2);
}
