export default {
    name: 'Number -> 4 bits',
    inputs: [
        {name: 'number', type: 'number'}
    ],
    outputs: [
        {name: 'bit1', type: 'boolean'},
        {name: 'bit2', type: 'boolean'},
        {name: 'bit3', type: 'boolean'},
        {name: 'bit4', type: 'boolean'}
    ],
    options: null,
    executor: number4bits
};

async function number4bits(ctx) {
    const number = ctx.getInput('number');
    if (!Number.isInteger(number) || number < 0 || number > 15) {
        throw new Error('expected integer between 0 and 15');
    }
    ctx.setOutput('bit1', Boolean(number & 0b1));
    ctx.setOutput('bit2', Boolean(number & 0b10));
    ctx.setOutput('bit3', Boolean(number & 0b100));
    ctx.setOutput('bit4', Boolean(number & 0b1000));
}
