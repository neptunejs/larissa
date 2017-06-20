export default {
    name: 'greyscale',
    inputs: [
        {name: 'image', type: 'image'}
    ],
    outputs: [
        {name: 'image', type: 'image'}
    ],
    options: {
        type: 'object',
        properties: {
            algorithm: {
                type: 'string',
                enum: ['luma709', 'luma601', 'maximum', 'minimum', 'average', 'minmax', 'red', 'green', 'blue', 'cyan', 'magenta', 'yellow', 'black', 'hue', 'saturation', 'lightness'],
                default: 'luma709',
                required: true
            }
        }
    },
    executor: greyscale
};

async function greyscale(ctx) {
    const image = ctx.getInput('image');
    const options = ctx.getOptions();
    ctx.setOutput('image', image.grey({algorithm: options.algorithm}));
}
