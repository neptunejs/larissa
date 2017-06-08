export default {
    name: 'load',
    inputs: [
        {name: 'path', label: 'Image path or URL', type: 'string'}
    ],
    outputs: [
        {name: 'loaded', label: 'Loaded image', type: 'image'}
    ],
    options: null,
    executor: loadImage
};

async function loadImage(ctx) {
    const path = ctx.getInput('path');
    const ImageJS = await import('image-js');
    ctx.setOutput('loaded', await ImageJS.default.load(path));
}
