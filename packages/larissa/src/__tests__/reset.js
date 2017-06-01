import Environment from '../Environment';
import {INSTANTIATED, FINISHED} from '../Node';

describe('reset method of nodes', () => {
    it('reset individual blocks', async () => {
        const env = new Environment();
        const plugin = freshPlugin();
        env.loadPlugin(plugin.definition);

        const pipeline = env.newPipeline();
        const node1 = pipeline.newNode('number', {value: 10});
        const node2 = pipeline.newNode('test/identity');
        pipeline.connect(node1, node2);
        expect(plugin.stats.executed).toEqual(0);

        await pipeline.run();
        expect(node2.output().getValue()).toEqual(10);
        expect(plugin.stats.executed).toEqual(1);

        await pipeline.run();
        expect(node2.output().getValue()).toEqual(10);
        expect(plugin.stats.executed).toEqual(1);

        node2.reset();

        await pipeline.run();
        expect(node2.output().getValue()).toEqual(10);
        expect(plugin.stats.executed).toEqual(2);
    });

    it('reset a block should change its parent status', async () => {
        const env = new Environment();
        const pipeline = env.newPipeline();
        const node1 = pipeline.newNode('number', {value: 42});
        const node1Output = node1.output();
        expect(node1.status).toEqual(INSTANTIATED);
        expect(pipeline.status).toEqual(INSTANTIATED);

        await pipeline.run();
        expect(node1Output.hasValue()).toEqual(true);
        expect(node1Output.getValue()).toEqual(42);
        expect(node1.status).toEqual(FINISHED);
        expect(pipeline.status).toEqual(FINISHED);

        node1.reset();
        expect(node1Output.hasValue()).toEqual(false);
        expect(node1.status).toEqual(INSTANTIATED);
        expect(pipeline.status).toEqual(INSTANTIATED);
    });
});

function freshPlugin() {
    const stats = {
        executed: 0
    };
    const definition = {
        name: 'test',
        blocks: [
            {
                name: 'identity',
                inputs: [{name: 'input'}],
                outputs: [{name: 'output'}],
                executor: (ctx) => {
                    stats.executed++;
                    ctx.setOutput('output', ctx.getInput('input'));
                }
            }
        ]
    };
    return {
        definition,
        stats
    };
}
