import Environment from '../Environment';
import Node, {ERRORED, FINISHED} from '../Node';

describe('Pipeline low level tests', function () {
    it('should detect updated status on nodes that the pipeline owns', function () {
        const env = new Environment();
        const pipeline = env.newPipeline();
        const node = pipeline.newNode('number');
        const otherNode = new Node();
        Object.defineProperty(otherNode, 'kind', {value: 'node'}); // required because addNode will read the kind
        pipeline.addNode(otherNode);

        {
            const cb = jest.fn();
            pipeline.on('child-status', cb);
            node.status = ERRORED;
            expect(cb.mock.calls.length).toBe(1);
            expect(cb.mock.calls[0][0]).toBe(ERRORED);
        }

        {
            const cb = jest.fn();
            pipeline.on('child-status', cb);
            otherNode.status = FINISHED;
            expect(cb.mock.calls.length).toBe(1);
            expect(cb.mock.calls[0][0]).toBe(FINISHED);
        }
    });
});
