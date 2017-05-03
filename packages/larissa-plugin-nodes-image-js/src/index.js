import loadImage from './nodes/loadImage';
import greyscale from './nodes/greyscale';

export default function () {
    return {
        name: 'image-js',
        blocks: [
            loadImage,
            greyscale
        ]
    };
}
