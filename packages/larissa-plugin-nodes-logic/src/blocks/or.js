export default {
    name: 'OR',
    inputs: [
        {name: 'boolean1', type: 'boolean'},
        {name: 'boolean2', type: 'boolean'},
    ],
    outputs: [
        {name: 'boolean', type: 'boolean'}
    ],
    options: null,
    executor: or
};

async function or(ctx) {
    const value1 = ctx.getInput('boolean1');
    const value2 = ctx.getInput('boolean2');
    ctx.setOutput('boolean', value1 || value2);
}
