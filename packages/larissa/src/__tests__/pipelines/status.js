import Environment from '../../Environment';
import {RUNNING, FINISHED} from '../../Node';

test('check that status events are correctly emitted from pipeline when running it', async () => {
    const env = new Environment();
    const pipeline = env.newPipeline();
    const node = pipeline.newNode('number', {value: 5});

    const status = jest.fn();
    const childStatus = jest.fn();
    pipeline.on('status', status);
    pipeline.on('child-status', childStatus);
    await pipeline.run();

    expect(status.mock.calls.length).toBe(2);
    expect(status.mock.calls[0][0]).toBe(RUNNING);
    expect(status.mock.calls[1][0]).toBe(FINISHED);

    expect(childStatus.mock.calls.length).toBe(2);
    expect(childStatus.mock.calls[0]).toEqual([RUNNING, node]);
    expect(childStatus.mock.calls[1]).toEqual([FINISHED, node]);
});
