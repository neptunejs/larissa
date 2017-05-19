import Environment from '../Environment';
import Node, {ERRORED, FINISHED} from '../Node';
import sinon from 'sinon';
describe('Pipeline low level tests', function() {
    it('should detect updated status on nodes that the pipeline owns', function () {
        const env = new Environment();
        const pipeline = env.newPipeline();
        const node = pipeline.newNode('number');
        const otherNode = new Node();
        pipeline.addNode(otherNode);
        let spy = sinon.spy();
        pipeline.on('child-status', spy);
        node.status = ERRORED;
        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, ERRORED, node);

        spy = sinon.spy();
        pipeline.on('child-status', spy);
        otherNode.status = FINISHED;
        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, FINISHED, otherNode);
    });
});
