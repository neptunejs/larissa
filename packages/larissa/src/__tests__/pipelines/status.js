import Environment from '../../Environment';
import {RUNNING, FINISHED} from '../../Node';

test('check that status events are correctly emitted from pipeline when running it', async () => {
    const env = new Environment();
    const pipeline = env.newPipeline();
    const node = pipeline.newNode('number', {value: 5});

    const status = jest.fn();
    const childStatus = jest.fn();
    pipeline.on('change', status);
    pipeline.on('child-change', childStatus);
    await pipeline.run();

    expect(status.mock.calls.length).toBe(2);
    expect(status.mock.calls[0]).toEqual(['status', RUNNING]);
    expect(status.mock.calls[1]).toEqual(['status', FINISHED]);

    expect(childStatus.mock.calls.length).toBe(2);
    expect(childStatus.mock.calls[0]).toEqual([node, 'status', RUNNING]);
    expect(childStatus.mock.calls[1]).toEqual([node, 'status', FINISHED]);
});
