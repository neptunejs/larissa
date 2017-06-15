import Environment from '../../Environment';

describe('pipeline inceptions', function () {
    it('run a pipeline in a pipeline', async () => {
        const env = new Environment();
        const pIn = env.newPipeline();
        const five = pIn.newNode('number', {value: 5});
        const prod = pIn.newNode('product');
        pIn.connect(five, prod);
        pIn.linkInput(prod.input(), 'number');
        pIn.linkOutput(prod.output(), 'result');

        const pOut = env.newPipeline();
        const ten = pOut.newNode('number', {value: 10});
        const two = pOut.newNode('number', {value: 2});
        const div = pOut.newNode('division');
        pOut.addNode(pIn);
        pOut.connect(ten.output(), pIn.input('number'));
        pOut.connect(pIn.output('result'), div.input('dividend'));
        pOut.connect(two, div.input('divisor'));

        await pOut.run();
        expect(div.output().getValue()).toBe(25);
    });

    it('toJSON pipeline in a pipeline', function () {
        const env = new Environment();
        const pIn = env.newPipeline();
        const five = pIn.newNode('number', {value: 5});
        pIn.linkOutput(five.output(), 'result');

        const pOut = env.newPipeline();
        pOut.addNode(pIn);
        pOut.toJSON(); // should not throw
    });
});
