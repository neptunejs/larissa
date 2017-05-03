// @flow
import BlockTypes from './BlockTypes';

export default class Plugin {
    name: string;
    blockTypes: BlockTypes;

    constructor(definition: Object) {
        if (typeof definition !== 'object' || definition === null) {
            throw new TypeError('plugin definition must be an object');
        }
        if (!definition.name || definition.name === '') {
            throw new TypeError('plugin.name must be a string');
        }
        this.name = definition.name;
        this.blockTypes = new BlockTypes();
        if (definition.blocks) {
            if (!Array.isArray(definition.blocks)) {
                throw new TypeError('plugin.blocks must be an array if present');
            }
            definition.blocks.forEach((block) => {
                this.blockTypes.addBlock(block);
            });
        }
    }
}
