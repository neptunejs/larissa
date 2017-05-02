import loadImage from './nodes/loadImage';
import greyscale from './nodes/greyscale';

export default function () {
    return {
        nodes: [
            loadImage,
            greyscale
        ]
    };
}
