import Environment from '../../Environment';

test.skip('loop over an array to double the values', async () => {
    const env = new Environment();
    const p = env.newPipeline();
    const string = p.newNode('string', {value: '[0, 5, 10, 1]'});
    const json = p.newNode('json-parse');
    p.connect(string, json);

    const inner = env.newPipeline();
    const two = inner.newNode('number', {value: 2});
    const product = inner.newNode('product');
    inner.connect(two, product);
    inner.linkInput(product.input(), 'number');
    inner.linkOutput(product.output(), 'result');

    const loop = p.newLoop(inner, {
        type: 'map'
    });
    p.connect(json, loop);

    await p.run();
    expect(loop.output().getValue()).toEqual([0, 10, 20, 2]);
});
