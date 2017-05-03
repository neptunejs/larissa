// @flow
import schemaValidator from 'is-my-json-valid';

export default class BlockTypes {
    blocks: Map<string, BlockType>;

    constructor() {
        this.blocks = new Map();
    }

    addBlock(definition: Object) {
        if (typeof definition.name !== 'string' || definition.name === '') {
            throw new TypeError('block name must be a string');
        }
        if (this.blocks.has(definition.name)) {
            throw new Error(`existing block with name ${definition.name}`);
        }
        this.blocks.set(definition.name, new BlockType(definition));
    }

    getBlock(name: string) {
        return this.blocks.get(name);
    }
}

class BlockType {
    name: string;
    inputs: Array<Object>;
    outputs: Array<Object>;
    schema: ?Object;
    validator: ?(Object) => void;
    executor: (Object) => Promise<mixed>;

    constructor(definition: Object) {
        this.name = definition.name;
        this.inputs = [];
        this.outputs = [];
        this.schema = null;
        this.validator = null;

        if (typeof definition.executor !== 'function') {
            throw new TypeError('block executor must be a function');
        }
        this.executor = definition.executor;

        if (definition.inputs) {
            if (!Array.isArray(definition.inputs)) {
                throw new TypeError('block inputs must be an array if present');
            }
            this.inputs = definition.inputs.slice();
        }

        if (definition.outputs) {
            if (!Array.isArray(definition.outputs)) {
                throw new TypeError('block outputs must be an array if present');
            }
            this.outputs = definition.outputs.slice();
        }

        if (definition.options) {
            this.schema = definition.options;
            this.validator = schemaValidator(definition.options);
        }
    }
}
