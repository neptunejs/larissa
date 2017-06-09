import loadImage from './nodes/loadImage';
import greyscale from './nodes/greyscale';
import mask from './nodes/mask';
import roi from './nodes/roi';

export default function () {
    return {
        name: 'image-js',
        blocks: [
            loadImage,
            greyscale,
            mask,
            roi
        ]
    };
}
