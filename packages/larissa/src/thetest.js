// @flow
import Environment from './Environment';
import imageJsPlugin from 'larissa-plugin-nodes-image-js';

// async function createPipeline() {
//     const pipeline = new Pipeline();
//     const node1 = pipeline.addNode('image-js/load', {
//         path: './image.png'
//     });
//
//     const node2 = pipeline.addNode('image-js/greyscale');
//     pipeline.connect(node1.output('loaded'), node2.input('image'));
//
//     await pipeline.executeNode(node2);
//     await pipeline.executeAll();
//
//     node2.reset(); // clean internal data (must be recalculated)
//
//     const output = node2.output('image');
//     output.hasValue();
//     const value = output.getValue(); // throw if not present?
//
//     pipeline.reset();
//     return pipeline;
// }


async function test() {
    const env = new Environment();
    env.loadPlugin(imageJsPlugin());
    const pipeline = env.newPipeline();
    const node1 = pipeline.newNode('image-js/load', {path: './test/image.png'});
    const node2 = pipeline.newNode('image-js/greyscale');
    pipeline.connect(node1, node2);
    await pipeline.run();
    console.log(node2.output().getValue()); // eslint-disable-line no-console
}

export default test;
