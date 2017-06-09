export default {
    name: 'PCA',
    inputs: [
        {name: 'dataset', type: 'matrix'}
    ],
    outputs: [
        // {name: 'variance', type: 'array'},
        // {name: 'model', type: 'pca-model'},
        // {name: 'loadings', type: 'pca-loadings'},
        {name: 'projection', type: 'table'}
    ],
    options: null,
    executor: pca
};

async function pca(ctx) {
    const PCA = await import('ml-pca');
    const dataset = ctx.getInput('dataset');
    const result = new PCA(dataset);
    const projection = result.predict(dataset);
    const output = {
        headers: projection[0].map((v, i) => `PC${i + 1}`),
        data: projection
    };
    debugger;
    ctx.setOutput('projection', output);
}
