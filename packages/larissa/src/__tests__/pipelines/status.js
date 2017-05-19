import Environment from '../../Environment';
import sinon from 'sinon';
import {RUNNING, FINISHED} from '../../Node';

test('check that status events are correctly emitted from pipeline when running it', async () => {
    const env = new Environment();
    const pipeline = env.newPipeline();
    const node = pipeline.newNode('number', {value: 5});

    const status = sinon.spy();
    const childStatus = sinon.spy();
    pipeline.on('status', status);
    pipeline.on('child-status', childStatus);
    await pipeline.run();

    expect(status.callCount).toBe(2);
    expect(status.getCall(0).args).toEqual([RUNNING]);
    expect(status.getCall(1).args).toEqual([FINISHED]);

    expect(childStatus.callCount).toBe(2);
    expect(childStatus.getCall(0).args).toEqual([RUNNING, node]);
    expect(childStatus.getCall(1).args).toEqual([FINISHED, node]);
});
