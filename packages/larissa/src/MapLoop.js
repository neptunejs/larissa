// @flow
import Node, {READY} from './Node';
import Input from './InputPort';
import Output from './OutputPort';
import {inputsToArray, outputsToArray} from './pipelineUtils';

class MapLoop extends Node {
    loopNode: Node;

    constructor(node: Node) {
        super();

        if (!node.hasDefaultInput()) {
            throw new Error(`node ${node.id} has no default input`);
        }
        if (!node.hasDefaultOutput()) {
            throw new Error(`node ${node.id} has no default output`);
        }

        this.loopNode = node;
        this.title = 'MapLoop';

        const input = new Input(this, {name: '@@input', type: 'array', required: true});
        this.inputs.set('@@input', input);
        this.defaultInput = input;

        const output = new Output(this, {name: '@@output', type: 'array', required: true});
        this.outputs.set('@@output', output);
        this.defaultOutput = output;

        for (let [key, val] of node.inputs.entries()) {
            if (val !== node.defaultInput) {
                const input = new Input(this, val);
                this.inputs.set(key, input);
            }
        }

        node.on('change', () => {
            this.emit('child-change', node);
            this.emit('deep-child-change', node);
        });
        node.on('deep-child-change', (node) => {
            this.emit('deep-child-change', node);
        });
    }

    get kind(): string {
        return 'map-loop';
    }

    _canRun() {
        return true;
    }

    async _run() {
        const thisOutput = this.defaultOutput;
        const thisInput = this.defaultInput;
        const loopNodeOutput = this.loopNode.defaultOutput;
        const loopNodeInput = this.loopNode.defaultInput;
        if (!thisOutput || !thisInput || !loopNodeOutput || !loopNodeInput) throw new Error('default ports should exist');
        const values = thisInput.getValue();
        const result = [];
        for (const input of this.inputs.values()) {
            if (input !== thisInput) {
                const innerInput = this.loopNode.inputs.get(input.name);
                if (!innerInput) throw new Error('unreachable');
                innerInput.setValue(input.getValue());
            }
        }

        for (const val of values) {
            this.loopNode.resetInput(loopNodeInput);
            loopNodeInput.setValue(val);
            await this.loopNode.run();
            result.push(loopNodeOutput.getValue());
        }

        thisOutput.setValue(result);
    }

    _computeStatus() {
        return READY;
    }

    inspect() {
        return {
            status: this.status,
            node: this.toJSON(),
        }
    }

    toJSON() {
        return {
            kind: 'map-loop',
            id: this.id,
            title: this.title,
            inputs: inputsToArray(this.inputs),
            outputs: outputsToArray(this.outputs),
            loopNode: this.loopNode.toJSON()
        }
    }
}

export default MapLoop;
