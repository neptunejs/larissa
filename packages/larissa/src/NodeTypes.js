// @flow
import schemaValidator from 'is-my-json-valid';

export default class NodeTypes {
    nodes: Map<string, NodeType>;

    constructor() {
        this.nodes = new Map();
    }

    addNode(definition: Object) {
        if (typeof definition.name !== 'string' || definition.name === '') {
            throw new TypeError('node name must be a string');
        }
        if (this.nodes.has(definition.name)) {
            throw new Error(`existing node with name ${definition.name}`);
        }
        this.nodes.set(definition.name, new NodeType(definition));
    }

    getNode(name: string) {
        return this.nodes.get(name);
    }
}

class NodeType {
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
            this.schema = definition.options;
            this.validator = schemaValidator(definition.options);
        }
    }
}
