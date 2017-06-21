import type InputPort from './InputPort';
import type OutputPort from './OutputPort';
import type LinkedPort from './LinkedPort';

export function inputsToArray(ports: Map<string, InputPort>, linkedInputs: ?Map<string, LinkedPort>): Array<Object> {
    const arr = [];
    for (let port of ports.values()) {
        const obj = {
            id: port.id,
            name: port.name,
            multiple: port.multiple,
            required: port.required,
            link: {}
        };
        if (linkedInputs) {
            for (let [linkId, linkValue] of linkedInputs) {
                if (linkValue.input.id === port.id) {
                    const split = linkId.split('_');
                    obj.link.id = split[0];
                    obj.link.name = split[2];
                }
            }
        }
        arr.push(obj);
    }
    return arr;
}

export function outputsToArray(ports: Map<string, OutputPort>, linkedOutputs: ?Map<string, LinkedPort>): Array<Object> {
    const arr = [];
    for (let port of ports.values()) {
        const obj = {
            id: port.id,
            name: port.name,
            link: {}
        };
        if (linkedOutputs) {
            for (let [linkId, linkValue] of linkedOutputs) {
                if (linkValue.output.id === port.id) {
                    const split = linkId.split('_');
                    obj.link.id = split[0];
                    obj.link.name = split[2];
                }
            }
        }
        arr.push(obj);
    }
    return arr;
}
