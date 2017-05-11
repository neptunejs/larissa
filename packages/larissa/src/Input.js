// @flow
import Port from './Port';

export default class Input extends Port {
    getDirection() {
        return 'input';
    }
}
