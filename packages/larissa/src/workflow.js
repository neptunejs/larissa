/*
    Experiment executing the workflow for image analysis
 */
import Nodes from './nodes';

import imageJsPlugin from 'larissa-plugin-nodes-image-js';

const nodes = new Nodes();

function workflow() {
    const plugin = imageJsPlugin();
    if (plugin.nodes) {
        if (!Array.isArray(plugin.nodes)) {
            throw new TypeError('plugin.nodes must be an array');
        }
        plugin.nodes.forEach((node) => {
            nodes.addNode(node);
        })
    }
    console.log(nodes.getNode('image-js-load'));
}

export default workflow;
