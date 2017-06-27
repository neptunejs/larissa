import Node, {INSTANTIATED, ERRORED} from '../Node';

describe('node low level tests', function () {
    it('change a nodes status', function () {
        const node = new Node();
        expect(node.status).toBe(INSTANTIATED);

        const cb = jest.fn();
        node.on('status', cb);
        node.status = ERRORED;
        expect(cb.mock.calls.length).toBe(1);
        expect(cb.mock.calls[0][0]).toBe(ERRORED);
    });
});
