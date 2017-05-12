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
    error: Error;

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
        this.status = INSTANTIATED;
        for (const input of this.inputs.values()) {
            input.reset();
        }
        for (const output of this.outputs.values()) {
            output.reset();
        }
    }

    async run() {
        if (this.status === RUNNING) {
            throw new Error('node is already running');
        }
        if (this.status === FINISHED) {
            return;
        }
        this.status = RUNNING;
        try {
            await this._run();
        } catch (e) {
            this.status = ERRORED;
            this.error = e;
            throw e;
        }
        this.status = FINISHED;
    }

    async _run() {
        throw new Error('Node.run: implement me');
    }

    toJSON() {
        return {
            kind: 'node'
        };
    }
}

export const INSTANTIATED: 'INSTANTIATED' = 'INSTANTIATED';
export const ERRORED: 'ERRORED' = 'ERRORED';
export const RUNNING: 'RUNNING' = 'RUNNING';
export const FINISHED: 'FINISHED' = 'FINISHED';

type NodeStatus = typeof ERRORED | typeof INSTANTIATED | typeof RUNNING | typeof FINISHED;
