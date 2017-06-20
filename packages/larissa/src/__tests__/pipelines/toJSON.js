import Environment from '../../Environment';

test('pipeline toJSON and new from JSON', async () => {
    const env = new Environment();
    const pipeline = env.newPipeline();
    const number1 = pipeline.newNode('number', {value: 5});
    const number2 = pipeline.newNode('number', {value: 10});
    const sum = pipeline.newNode('sum');
    pipeline.connect(number1, sum);
    pipeline.connect(number2, sum);
    pipeline.linkOutput(sum.output(), 'sumResult');
    pipeline.linkOptions('number1', number1);
    await pipeline.run();
    expect(number1.output().getValue()).toBe(5);
    expect(number2.output().getValue()).toBe(10);
    expect(sum.output().getValue()).toBe(15);

    const json = JSON.stringify(pipeline);
    const newPipeline = env.pipelineFromJSON(JSON.parse(json));
    newPipeline.setOptions({
        number1: {
            value: 7
        }
    });
    await newPipeline.run();
    expect(newPipeline.output('sumResult').getValue()).toBe(17);

    expect(newPipeline.findNode(number1.id)).toBe(null);
    expect(newPipeline.findNode(number2.id)).toBe(null);
    expect(newPipeline.findNode(sum.id)).toBe(null);
    expect(newPipeline.id).not.toBe(pipeline.id);
});
