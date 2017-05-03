import Environment from '../Environment';

describe('Environment', () => {
    it('construction', () => {
        new Environment();
    });

    it('load an empty plugin', () => {
        const env = new Environment();
        expect(() => {
            env.loadPlugin({});
        }).toThrow(/plugin\.name must be a string/);
    });

    it('load twice the same plugin', () => {
        const env = new Environment();
        env.loadPlugin({name: 'test'});
        expect(() => {
            env.loadPlugin({name: 'test'});
        }).toThrow(/a plugin with name "test" is already loaded/);
    });

    it('load two plugins', () => {
        const env = new Environment();
        env.loadPlugin({name: 'test1'});
        env.loadPlugin({name: 'test2'});
        expect(env.plugins.has('test1')).toEqual(true);
        expect(env.plugins.has('test2')).toEqual(true);
    });
});
