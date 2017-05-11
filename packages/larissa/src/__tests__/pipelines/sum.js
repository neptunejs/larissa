import Environment from '../../Environment';

test('pipeline - add two numbers', async () => {
    const env = new Environment();
    const pipeline = env.newPipeline();
    const number1 = pipeline.newNode('number', {value: 5});
    const number2 = pipeline.newNode('number', {value: 10});
    const rng = pipeline.newNode('rng');
    const sum = pipeline.newNode('sum');
    pipeline.connect(number1, sum);
    pipeline.connect(number2, sum);
    pipeline.connect(rng, sum);
    await pipeline.run();
    expect(number1.output().getValue()).toEqual(5);
    expect(number2.output().getValue()).toEqual(10);
    const out = sum.output().getValue();
    expect(out).toBeGreaterThanOrEqual(15);
    expect(out).toBeLessThan(16);
});
