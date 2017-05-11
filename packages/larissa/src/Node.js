// @flow
import uuid from 'uuid/v4';

import Input from './Input';
import Output from './Output';

export default class Node {
    id: string;
    status: NodeStatus;
    inputs: Map<string, Input>;
    outputs: Map<string, Output>;
    defaultInput: ?Input;
    defaultOutput: ?Output;

    constructor() {
        this.id = uuid();
        this.inputs = new Map();
        this.outputs = new Map();
    }

    output(name?: string): Output {
        if (name === undefined) {
            const output = this.defaultOutput;
            if (!output) throw new Error('Node has no default output');
            return output;
        } else {
            const output = this.outputs.get(name);
            if (!output) throw new Error(`Unknown output: ${name}`);
            return output;
        }
    }

    input(name?: string): Input {
        if (name === undefined) {
            const input = this.defaultInput;
            if (!input) throw new Error('Node has no default input');
            return input;
        } else {
            const input = this.inputs.get(name);
            if (!input) throw new Error(`Unknown input: ${name}`);
            return input;
        }
    }

    reset(): void {
        // TODO: delete output
    }

    runCheck() {
        if (this.status === RUNNING) {
            throw new Error('node is already running');
        }
    }

    async run() {
        throw new Error('Node.run: implement me');
    }
}

export const INSTANTIATED: 'INSTANTIATED' = 'INSTANTIATED';
export const RUNNING: 'RUNNING' = 'RUNNING';
export const FINISHED: 'FINISHED' = 'FINISHED';

type NodeStatus = typeof INSTANTIATED | typeof RUNNING | typeof FINISHED;
