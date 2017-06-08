export default {
    name: 'PCA',
    inputs: [
        {name: 'dataset', type: 'matrix'}
    ],
    outputs: [
        // {name: 'variance', type: 'array'},
        // {name: 'model', type: 'pca-model'},
        // {name: 'loadings', type: 'pca-loadings'},
        {name: 'projection', type: 'matrix'}
    ],
    options: null,
    executor: pca
};

async function pca(ctx) {
    const PCA = await import('ml-pca');
    const dataset = ctx.getInput('dataset');
    const result = new PCA(dataset);
    ctx.setOutput('projection', result.predict(dataset));
}
