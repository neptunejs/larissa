import Environment from '../../Environment';

test('pipeline - disconnect nodes', async () => {
    const env = new Environment();
    const pipeline = env.newPipeline();
    const number1 = pipeline.newNode('number', {value: 5});
    const number2 = pipeline.newNode('number', {value: 10});
    const sum = pipeline.newNode('sum');
    pipeline.connect(number1, sum);
    pipeline.connect(number2, sum);

    await pipeline.run();
    expect(number1.output().getValue()).toBe(5);
    expect(number2.output().getValue()).toBe(10);
    const out = sum.output().getValue();
    expect(out).toBe(15);

    expect(() => pipeline.connect(number2, sum)).toThrow(/the connection already exists/);

    pipeline.disconnect(number2, sum);
    await pipeline.run();
    expect(sum.output().getValue()).toBe(5);

    pipeline.connect(number2, sum);
    await pipeline.run();
    expect(sum.output().getValue()).toBe(15);

    pipeline.disconnect(number2, sum);
    expect(() => pipeline.disconnect(number2, sum)).toThrow(/^no connection found between nodes/);
});
