import Node, {INSTANTIATED, ERRORED} from '../Node';
import sinon from 'sinon';

describe('node low level tests', function () {
    it('change a nodes status', function () {
        const node = new Node();
        expect(node.status).toBe(INSTANTIATED);

        const spy = sinon.spy();
        node.on('status', spy);
        node.status = ERRORED;
        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, ERRORED);
    });
});
