// @flow
import Input from './Input';
import Output from './Output';

export default class Node {
    output(name: string): Output {
        return new Output({name});
    }

    input(name: string): Input {
        return new Input({name});
    }

    reset(): void {
        // TODO: delete output
    }
}
