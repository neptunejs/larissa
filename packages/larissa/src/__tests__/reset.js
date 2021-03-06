import Environment from '../Environment';
import {INSTANTIATED, READY, FINISHED} from '../Node';

describe('reset method of nodes', () => {
    it('reset individual blocks', async () => {
        const env = new Environment();
        const plugin = freshPlugin();
        env.loadPlugin(plugin.definition);

        const pipeline = env.newPipeline();
        const node1 = pipeline.newNode('number', {value: 10});
        const node2 = pipeline.newNode('test/identity');
        pipeline.connect(node1, node2);
        expect(plugin.stats.executed).toBe(0);

        await pipeline.run();
        expect(node2.output().getValue()).toBe(10);
        expect(plugin.stats.executed).toBe(1);

        await pipeline.run();
        expect(node2.output().getValue()).toBe(10);
        expect(plugin.stats.executed).toBe(1);

        node2.reset();

        await pipeline.run();
        expect(node2.output().getValue()).toBe(10);
        expect(plugin.stats.executed).toBe(2);
    });

    it('reset a block should change its parent status', async () => {
        const env = new Environment();
        const pipeline = env.newPipeline();
        const node1 = pipeline.newNode('number', {value: 42});
        const node1Output = node1.output();
        expect(node1.status).toBe(READY);
        expect(pipeline.status).toBe(READY);

        await pipeline.run();
        expect(node1Output.hasValue()).toBe(true);
        expect(node1Output.getValue()).toBe(42);
        expect(node1.status).toBe(FINISHED);
        expect(pipeline.status).toBe(FINISHED);

        node1.reset();
        expect(node1Output.hasValue()).toBe(false);
        expect(node1.status).toBe(READY);
        expect(pipeline.status).toBe(READY);
    });

    it('block status after options are added', async () => {
        const env = new Environment();
        const pipeline = env.newPipeline();
        const node = pipeline.newNode('number');

        expect(node.status).toBe(INSTANTIATED);
        node.setOptions({value: 42});
        expect(node.status).toBe(READY);
        await pipeline.runNode(node);
        expect(node.status).toBe(FINISHED);
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
