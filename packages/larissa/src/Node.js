// @flow
import uuid from 'uuid/v4';

import Input from './Input';
import Output from './Output';

export default class Node {
    id: string;
    status: NodeStatus;
    inputs: Map<string, Input>;
    outputs: Map<string, Output>;

    constructor() {
        this.id = uuid();
        this.inputs = new Map();
        this.outputs = new Map();
    }

    output(name: string = 'default'): Output {
        const output = this.outputs.get(name);
        if (output !== undefined) {
            return output;
        }
        throw new Error(`Unknown output: ${name}`);
    }

    input(name: string = 'default'): Input {
        const input = this.inputs.get(name);
        if (input !== undefined) {
            return input;
        }
        throw new Error(`Unknown input: ${name}`);
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
