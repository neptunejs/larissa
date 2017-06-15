export default {
    name: '4 bits -> number',
    inputs: [
        {name: 'bit1', type: 'boolean'},
        {name: 'bit2', type: 'boolean'},
        {name: 'bit3', type: 'boolean'},
        {name: 'bit4', type: 'boolean'}
    ],
    outputs: [
        {name: 'number', type: 'number'}
    ],
    options: null,
    executor: fourBitsNumber
};

async function fourBitsNumber(ctx) {
    const bit1 = ctx.getInput('bit1');
    const bit2 = ctx.getInput('bit2');
    const bit3 = ctx.getInput('bit3');
    const bit4 = ctx.getInput('bit4');
    ctx.setOutput('number', bit1 | bit2 << 1 | bit3 << 2 | bit4 << 3);
}
