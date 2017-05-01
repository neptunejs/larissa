/* eslint-disable */
/*
    Experiment executing the workflow for image analysis
 */
import Nodes from './nodes';

import imageJsPlugin from 'larissa-plugin-nodes-image-js';

const nodes = new Nodes();

function loadPlugin() {
    const plugin = imageJsPlugin();
    if (plugin.nodes) {
        if (!Array.isArray(plugin.nodes)) {
            throw new TypeError('plugin.nodes must be an array');
        }
        plugin.nodes.forEach((node) => {
            nodes.addNode(node);
        });
    }
}

function test() {
    loadPlugin();

}

export default test;
