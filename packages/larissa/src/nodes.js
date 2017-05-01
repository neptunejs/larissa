import schemaValidator from 'is-my-json-valid';

const kNodes = Symbol('nodes');

export default class Nodes {
    constructor() {
        this[kNodes] = new Map();
    }

    addNode(definition) {
        if (typeof definition.name !== 'string' || definition.name === '') {
            throw new TypeError('node name must be a string');
        }
        if (this[kNodes].has(definition.name)) {
            throw new Error(`existing node with name ${definition.name}`);
        }
        this[kNodes].set(definition.name, new Node(definition));
    }

    getNode(name) {
        return this[kNodes].get(name);
    }
}

class Node {
    constructor(definition) {
        this.name = definition.name;
        this.inputs = [];
        this.outputs = [];
        this.options = {
            schema: null,
            validator: null
        };

        if (typeof definition.executor !== 'function') {
            throw new TypeError('node executor must be a function');
        }
        this.executor = definition.executor;

        if (definition.inputs) {
            if (!Array.isArray(definition.inputs)) {
                throw new TypeError('node inputs must be an array');
            }
            this.inputs = definition.inputs.slice();
        }

        if (definition.outputs) {
            if (!Array.isArray(definition.outputs)) {
                throw new TypeError('node outputs must be an array');
            }
            this.outputs = definition.outputs.slice();
        }

        if (definition.options) {
            this.options.schema = definition.options;
            this.options.validator = schemaValidator(definition.options);
        }
    }
}
