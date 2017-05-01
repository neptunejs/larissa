import Image from 'image-js';

export default function loadImage(ctx) {
    const path = ctx.options.path;
    return Image.load(path);
}
