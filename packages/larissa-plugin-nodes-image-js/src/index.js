import loadImage from './loadImage';
import greyscale from './greyscale';

export default function () {
    return {
        nodes: [
            loadImage,
            greyscale
        ]
    };
}
