import loadImage from './loadImage';

export default function () {
    return {
        nodes: [
            {
                name: 'image-js-load',
                inputs: [],
                outputs: [
                    {name: 'loaded', label: 'Loaded image'}
                ],
                options: {
                    type: 'object',
                    properties: {}
                },
                executor: loadImage
            }
        ]
    };
}
