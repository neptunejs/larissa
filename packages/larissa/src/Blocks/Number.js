export default {
    name: 'greyscale',
    inputs: [
        {name: 'image'}
    ],
    outputs: [
        {name: 'image'}
    ],
    options: {
        type: 'number',
        required: true
    },
    executor: setOutput
};

async function setOutput(ctx) {
    ctx.setOutput('image', ctx.options.value);
}
