export default {
    name: 'greyscale',
    inputs: [
        {name: 'image', type: 'image'}
    ],
    outputs: [
        {name: 'image', type: 'image'}
    ],
    options: null,
    executor: greyscale
};

async function greyscale(ctx) {
    const image = ctx.getInput('image');
    ctx.setOutput('image', image.grey());
}
