// @flow
import Port from './Port';

export default class Output extends Port {
    getDirection() {
        return 'output';
    }
}
