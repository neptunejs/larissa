// @flow
import Port from './Port';

export default class Output extends Port {
    constructor(options: Object) {
        super(options);
    }

    hasValue(): boolean {
        return true;
    }

    getValue(): any {
        return null;
    }
}
