// @flow
import Port from './Port';

export default class Output extends Port {
    value: mixed;

    constructor(options: Object) {
        super(options);
    }

    hasValue(): boolean {
        return this.value !== undefined;
    }

    getValue(): mixed {
        return this.value;
    }

    setValue(value: mixed) {
        this.value = value;
    }
}
