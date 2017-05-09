// A very simple block that takes several numbers as input and outputs their sum

export default {
    name: 'greyscale',
    inputs: [
        {
            name: 'value',
            many: true,
            type: 'number'
        }
    ],
    outputs: [
        {
            name: 'sum',
            type: 'number'
        }
    ],
    options: null,
    executor: computeSum
};

async function computeSum(ctx) {
    const numbers = ctx.getInput('value');
    return numbers.reduce((prev, current) => prev + current, 0);
}
