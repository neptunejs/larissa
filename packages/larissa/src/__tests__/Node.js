import Node, {INSTANTIATED, ERRORED} from '../Node';
import sinon from 'sinon';

test('node status', function () {
    const node = new Node();
    expect(node.status).toBe(INSTANTIATED);

    const spy = sinon.spy();
    node.on('status', spy);
    node.status = ERRORED;
    sinon.assert.calledWith(spy, ERRORED);
});