import Environment from '../../Environment';
import imageJsPlugin from 'larissa-plugin-nodes-image-js';

test('pipeline - image load and apply grayscale filter', async () => {
    const env = new Environment();
    env.loadPlugin(imageJsPlugin());
    const pipeline = env.newPipeline();
    const url = pipeline.newNode('string', {value: './test/image.png'});
    const node1 = pipeline.newNode('image-js/load');
    const node2 = pipeline.newNode('image-js/greyscale');
    pipeline.connect(url, node1);
    pipeline.connect(node1, node2);
    await pipeline.run();
    const result = node2.output().getValue();
    expect(result.channels).toEqual(1);
});
