import Environment from '../../Environment';


describe('test pipeline node deletion', function () {
    it('should delete linkedInputs and linkedOutputs', function () {
        const env = new Environment();
        const pipeline = env.newPipeline();
        const identity1 = pipeline.newNode('identity');
        const identity2 = pipeline.newNode('identity');
        const identity3 = pipeline.newNode('identity');
        pipeline.connect(identity1, identity2);
        pipeline.connect(identity2, identity3);

        pipeline.linkInput(identity2.input(), 'linkedInput');
        pipeline.linkOutput(identity2.output(), 'linkedOutput');

        expect(pipeline.linkedInputs.size).toBe(1);
        expect(pipeline.linkedOutputs.size).toBe(1);
        expect(pipeline.inputs.size).toBe(1);
        expect(pipeline.outputs.size).toBe(1);

        pipeline.deleteNode(identity2);
        expect(pipeline.linkedInputs.size).toBe(0);
        expect(pipeline.linkedOutputs.size).toBe(0);
        expect(pipeline.inputs.size).toBe(0);
        expect(pipeline.outputs.size).toBe(0);
    });
});
