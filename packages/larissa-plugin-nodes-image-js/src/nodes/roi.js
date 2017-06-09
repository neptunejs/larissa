export default {
    name: 'roi',
    inputs: [
        {name: 'image', type: 'image'},
        {name: 'mask', type: 'image'},
    ],
    outputs: [
        {name: 'roi', type: 'image'}
    ],
    options: null,
    executor: roi
};

async function roi(ctx) {
    const image = ctx.getInput('image');
    const mask = ctx.getInput('mask');
    const manager = image.getRoiManager();
    manager.fromMask(mask);
    const roi = manager.getRois({negative: false});
    roi.sort((r1, r2) => r2.surface - r1.surface);
    const filledMask = roi[0].getMask({kind: 'filled', scale: 0.9});
    const extracted = image.extract(filledMask);
    ctx.setOutput('roi', extracted);
}
