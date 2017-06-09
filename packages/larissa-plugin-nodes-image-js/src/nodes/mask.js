export default {
    name: 'mask',
    inputs: [
        {name: 'image', type: 'image'}
    ],
    outputs: [
        {name: 'image', type: 'image'}
    ],
    options: null,
    executor: mask
};

async function mask(ctx) {
    const image = ctx.getInput('image');
    ctx.setOutput('image', image.mask());
}
