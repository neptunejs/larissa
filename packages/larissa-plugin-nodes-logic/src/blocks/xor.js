export default {
    name: 'XOR',
    inputs: [
        {name: 'boolean1', type: 'boolean'},
        {name: 'boolean2', type: 'boolean'}
    ],
    outputs: [
        {name: 'boolean', type: 'boolean'}
    ],
    options: null,
    executor: xor
};

async function xor(ctx) {
    const value1 = ctx.getInput('boolean1');
    const value2 = ctx.getInput('boolean2');
    ctx.setOutput('boolean', value1 ? !value2 : value2);
}
