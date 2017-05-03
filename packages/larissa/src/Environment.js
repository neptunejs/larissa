// @flow
import Pipeline from './Pipeline';
import Plugin from './Plugin';

export default class Environment {
    plugins: Map<string, Plugin>;

    constructor() {
        this.plugins = new Map();
    }

    loadPlugin(pluginDef: Object) {
        if (this.plugins.has(pluginDef.name)) {
            throw new Error(`a plugin with name "${pluginDef.name}" is already loaded`);
        }
        const plugin = new Plugin(pluginDef);
        this.plugins.set(plugin.name, new Plugin(pluginDef));
    }

    newPipeline() {
        return new Pipeline(this);
    }
}
