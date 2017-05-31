// @flow
import Port from './Port';

export default class OutputPort extends Port {
    getDirection() {
        return 'output';
    }
}
