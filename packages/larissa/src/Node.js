// @flow
import uuid from 'uuid/v4';

import Input from './Input';
import Output from './Output';

export default class Node {
    id: string;
    status: NodeStatus;
    inputs: Map<String, Input>;
    outputs: Map<String, Output>;

    constructor() {
        this.id = uuid();
        this.inputs = [];
        this.outputs = [];
    }

    output(name: string = 'default'): Output {
        return this.outputs.get(name);
    }

    input(name: string = 'default'): Input {
        return this.inputs.get(name);
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
