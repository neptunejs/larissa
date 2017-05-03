// @flow
import uuid from 'uuid/v4';

import Input from './Input';
import Output from './Output';

export default class Node {
    id: string;
    status: NodeStatus;

    constructor() {
        this.id = uuid();
    }

    output(name: string = 'default'): Output {
        return new Output({name});
    }

    input(name: string = 'default'): Input {
        return new Input({name});
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
