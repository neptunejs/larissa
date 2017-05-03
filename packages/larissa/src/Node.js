// @flow
import Input from './Input';
import Output from './Output';

export default class Node {
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
