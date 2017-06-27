import Environment from '../../Environment';

describe('link inputs and outputs', function () {
    it('should unlink input', function () {
        const env = new Environment();
        const pipeline = env.newPipeline();
        const identity1 = pipeline.newNode('identity');
        const identity2 = pipeline.newNode('identity');
        const identity3 = pipeline.newNode('identity');
        pipeline.connect(identity1, identity2);
        pipeline.connect(identity2, identity3);

        pipeline.linkInput(identity2.input(), 'linkedInput');

        expect(pipeline.linkedInputs.size).toBe(1);
        expect(pipeline.inputs.size).toBe(1);

        pipeline.unlinkInput('linkedInput');
        expect(pipeline.linkedInputs.size).toBe(0);
        expect(pipeline.inputs.size).toBe(0);

        expect(() => pipeline.input('linkedInput')).toThrow(/Unknown input/);
    });

    it('should unlink output', function () {
        const env = new Environment();
        const pipeline = env.newPipeline();
        const identity1 = pipeline.newNode('identity');
        const identity2 = pipeline.newNode('identity');
        const identity3 = pipeline.newNode('identity');
        pipeline.connect(identity1, identity2);
        pipeline.connect(identity2, identity3);

        pipeline.linkOutput(identity2.output(), 'linkedOutput');

        expect(pipeline.linkedOutputs.size).toBe(1);
        expect(pipeline.outputs.size).toBe(1);

        pipeline.unlinkOutput('linkedOutput');
        expect(pipeline.linkedOutputs.size).toBe(0);
        expect(pipeline.outputs.size).toBe(0);

        expect(() => pipeline.output('linkedOutput')).toThrow(/Unknown output/);
    });
});
