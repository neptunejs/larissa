import Plugin from '../Plugin';

describe('Plugin', () => {
    it('construction', () => {
        expect(() => new Plugin()).toThrow(/plugin definition must be an object/);
        expect(() => new Plugin({})).toThrow(/plugin\.name must be a string/);
        new Plugin({name: 'testplugin'});
    });

    it('blocks - error', () => {
        expect(() => {
            new Plugin({
                name: 'testplugin',
                blocks: 'wrong value'
            });
        }).toThrow(/plugin\.blocks must be an array if present/);
    });

    it('blocks', () => {
        const plugin = new Plugin({
            name: 'testplugin',
            blocks: [{
                name: 'testblock',
                executor: () => {}
            }]
        });
        expect(plugin.blockTypes.getBlock('testblock')).toBeDefined();
        expect(plugin.blockTypes.getBlock('notexist')).toEqual(undefined);
        const blockList = plugin.getBlockList();
        expect(blockList).toBeInstanceOf(Array);
        expect(blockList.length).toBe(1);
    });
});
