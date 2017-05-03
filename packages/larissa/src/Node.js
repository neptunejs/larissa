// @flow
import uuid from 'uuid/v4';

import Input from './Input';
import Output from './Output';

export default class Node {
    id: string;

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
}
