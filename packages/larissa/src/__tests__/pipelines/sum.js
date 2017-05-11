import Environment from '../../Environment';

test('pipeline - add two numbers', async () => {
    const env = new Environment();
    const pipeline = env.newPipeline();
    const node1 = pipeline.newNode('number', {value: 5});
    const node2 = pipeline.newNode('number', {value: 10});
    const node3 = pipeline.newNode('rng');
    const end = pipeline.newNode('sum');
    pipeline.connect(node1, end);
    pipeline.connect(node2, end);
    pipeline.connect(node3, end);
    await pipeline.run();
    expect(node1.output().getValue()).toEqual(5);
    expect(node2.output().getValue()).toEqual(10);
    const out = end.output().getValue();
    expect(out).toBeGreaterThanOrEqual(15);
    expect(out).toBeLessThan(16);
});
