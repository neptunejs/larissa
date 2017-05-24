// @flow
import uuid from 'uuid/v4';

import Input from './Input';
import Output from './Output';
import EventEmitter from 'events';

export default class Node extends EventEmitter {
    id: string;
    _status: NodeStatus;
    inputs: Map<string, Input>;
    outputs: Map<string, Output>;
    defaultInput: ?Input;
    defaultOutput: ?Output;
    error: Error;

    constructor() {
        super();
        this.id = uuid();
        this.inputs = new Map();
        this.outputs = new Map();
        this._status = INSTANTIATED;
    }

    get kind(): string {
        throw new Error('Node.kind: implement me');
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

    set status(status: NodeStatus) {
        if (this._status !== status) {
            this._status = status;
            this.emit('status', status);
        }
    }

    get status(): NodeStatus {
        return this._status;
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
        // TODO: how can we prevent the end-user to set status?
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

    inspect() {
        throw new Error('Node.inspect: implement me');
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
