// @flow
import Environment from '../src/Environment';


async function test() {
    const env = new Environment();
    const pipeline = env.newPipeline();
    const node1 = pipeline.newNode('Number', {value: 5});
    const node2 = pipeline.newNode('Number', {value: 10});
    const node3 = pipeline.newNode('Sum');
    pipeline.connect(node1, node3);
    pipeline.connect(node2, node3);
    await pipeline.run();
    console.log(node2.output().getValue()); // eslint-disable-line no-console
}

export default test;
