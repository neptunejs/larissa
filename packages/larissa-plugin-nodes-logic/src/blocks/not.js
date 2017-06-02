export default {
    name: 'NOT',
    inputs: [
        {name: 'boolean'}
    ],
    outputs: [
        {name: 'boolean'}
    ],
    options: null,
    executor: not
};

async function not(ctx) {
    const value = ctx.getInput('boolean');
    ctx.setOutput('boolean', !value);
}
