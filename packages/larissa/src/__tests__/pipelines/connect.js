import Environment from '../../Environment';

describe('connecting element in a pipeline', function () {
    it('connecting twice an input that does not allow multiple connections should throw', function () {
        const env = new Environment();
        const pipeline = env.newPipeline();
        const number1 = pipeline.newNode('number', {value: 5});
        const number2 = pipeline.newNode('number', {value: 10});
        const identity = pipeline.newNode('identity');
        pipeline.connect(number1, identity);
        expect(() => {
            pipeline.connect(number2, identity);
        }).toThrow(/input does not allow multiple connections/);
        expect(pipeline.getConnectedOutputs(identity.input())).toHaveLength(1);
    });

    it('connecting twice an input that does not allow multiple connections should replace the connection', function () {
        const env = new Environment();
        const pipeline = env.newPipeline();
        const number1 = pipeline.newNode('number', {value: 5});
        const number2 = pipeline.newNode('number', {value: 10});
        const identity = pipeline.newNode('identity');
        pipeline.connect(number1, identity);
        pipeline.connect(number2, identity, {
            replace: true
        });
        expect(pipeline.getConnectedOutputs(identity.input())).toHaveLength(1);
    });
});
