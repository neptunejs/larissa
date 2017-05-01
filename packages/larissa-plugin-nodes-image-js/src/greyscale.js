export default {
    name: 'image-js-greyscale',
    inputs: [
        {name: 'image'}
    ],
    outputs: [
        {name: 'image'}
    ],
    options: null,
    executor: greyscale
};

async function greyscale(ctx) {
    const image = ctx.getInput('image');
    ctx.setOutput('image', image.grey());
}
