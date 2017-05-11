// @flow
import Node from './Node';
import Input from './Input';
import Output from './Output';

import type {BlockType} from './BlockTypes';

export default class Block extends Node {
    blockType: BlockType;
    options: ?Object;

    constructor(blockType: BlockType, options?: Object) {
        super();
        this.blockType = blockType;
        this.options = options;
        createAllPorts(this);
    }

    async run(options: Object = {}) {
        const context = new Context(this, options);
        if (this.options && this.blockType.validator) {
            this.blockType.validator(this.options);
        }
        return this.blockType.executor(context);
    }
}

function createAllPorts(self: Block): void {
    createPorts(self, 'inputs', self.inputs, self.blockType.inputs, Input);
    createPorts(self, 'outputs', self.outputs, self.blockType.outputs, Output);
}

// todo change Constructor and P to an interface?
function createPorts<P>(self: Block, type: string, map: Map<string, P>, list: Array<Object>, Constructor: Class<any>) {
    let hasDefaultPort = false;
    for (const portDef of list) {
        const portName = portDef.name;
        const port = new Constructor(self, portDef);
        map.set(portName, port);
        if (list.length === 1) {
            if (type === 'inputs') self.defaultInput = port;
            else if (type === 'outputs') self.defaultOutput = port;
        }
        if (portDef.default) {
            if (hasDefaultPort) {
                throw new Error(`cannot have more than one default ${type}`);
            } else {
                hasDefaultPort = true;
                if (type === 'inputs') self.defaultInput = port;
                else if (type === 'outputs') self.defaultOutput = port;
            }
        }
    }
}

class Context {
    block: Block;
    constructor(block: Block) {
        this.block = block;
    }

    getOptions(): ?Object {
        return this.block.options;
    }

    getInput(name: string): any {
        return this.block.input(name).getValue();
    }

    setOutput(name: string, value: mixed): void {
        this.block.output(name).setValue(value);
    }
}

export type {Context};
