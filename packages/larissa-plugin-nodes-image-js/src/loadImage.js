import Image from 'image-js';

export default {
    name: 'load',
    inputs: [],
    outputs: [
        {name: 'loaded', label: 'Loaded image'}
    ],
    options: {
        type: 'object',
        properties: {
            path: {type: 'string', required: true}
        }
    },
    executor: loadImage
};

async function loadImage(ctx) {
    const path = ctx.options.path;
    ctx.setOutput('loaded', await Image.load(path));
}
