import Environment from '../../Environment';

test('pipeline - parse a json string', async () => {
    const env = new Environment();
    const pipeline = env.newPipeline();
    const json = '[1, 2]';
    const node1 = pipeline.newNode('string', {value: json});
    const node2 = pipeline.newNode('json-parse');
    pipeline.connect(node1, node2);
    await pipeline.run();
    expect(node1.output().getValue()).toEqual(json);
    expect(node2.output().getValue()).toEqual([1, 2]);
});
