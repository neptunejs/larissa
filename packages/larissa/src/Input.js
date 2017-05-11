// @flow
import Port from './Port';

export default class Input extends Port {
    multiple: boolean;

    constructor(...args: Array<any>) {
        super(...args);
        this.multiple = false;
    }

    getDirection() {
        return 'input';
    }

    isMultiple(): boolean {
        return this.multiple;
    }
}
