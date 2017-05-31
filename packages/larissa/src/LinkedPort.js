// @flow

import type InputPort from './InputPort';
import type OutputPort from './OutputPort';

export default class LinkedPort {
    input: InputPort;
    output: OutputPort;
    name: string;

    constructor(input: InputPort, output: OutputPort, name: string) {
        this.input = input;
        this.output = output;
        this.name = name;
    }
}
