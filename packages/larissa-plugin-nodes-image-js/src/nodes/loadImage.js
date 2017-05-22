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
    const path = ctx.getOptions().path;
    const ImageJS = await import('image-js');
    ctx.setOutput('loaded', await ImageJS.default.load(path));
}
