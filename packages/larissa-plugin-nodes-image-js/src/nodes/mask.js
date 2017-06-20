export default {
    name: 'mask',
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
                enum: ['threshold', 'huang', 'intermodes', 'isodata', 'li', 'maxEntropy', 'mean', 'minError', 'minimum', 'moments', 'otsu', 'percentile', 'renyiEntropy', 'shanbhag', 'triangle', 'yen'],
                default: 'threshold',
                required: true
            },
            threshold: {
                type: 'number',
                default: 128
            },
            useAlpha: {
                type: 'boolean',
                default: true
            },
            invert: {
                type: 'boolean',
                default: false
            }
        }
    },
    executor: mask
};

async function mask(ctx) {
    const image = ctx.getInput('image');
    ctx.setOutput('image', image.mask(ctx.getOptions()));
}
