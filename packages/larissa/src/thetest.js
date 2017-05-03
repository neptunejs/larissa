// @flow
/* eslint-disable */
/*
 Experiment executing the workflow for image analysis
 */
import NodeTypes from './BlockTypes';
import Pipeline from './Pipeline';
import imageJsPlugin from 'larissa-plugin-nodes-image-js';

const nodes = new NodeTypes();

function loadPlugin() {
    const plugin = imageJsPlugin();
    if (plugin.nodes) {
        if (!Array.isArray(plugin.nodes)) {
            throw new TypeError('plugin.blocks must be an array');
        }
        plugin.nodes.forEach((node) => {
            nodes.addBlock(node);
        });
    }
}

async function createPipeline() {
    const pipeline = new Pipeline();
    const node1 = pipeline.addNode('image-js/load', {
        path: './image.png'
    });

    const node2 = pipeline.addNode('image-js/greyscale');
    pipeline.connect(node1.output('loaded'), node2.input('image'));

    await pipeline.executeNode(node2);
    await pipeline.executeAll();

    node2.reset(); // clean internal data (must be recalculated)

    const output = node2.output('image');
    output.hasValue();
    const value = output.getValue(); // throw if not present?

    pipeline.reset();
    return pipeline;
}


async function test() {
    loadPlugin();
    await createPipeline();
}

export default test;
