// @flow
import Pipeline from './Pipeline';
import Plugin from './Plugin';

export default class Environment {
    plugins: Map<string, Plugin>;

    constructor() {
        this.plugins = new Map();
    }

    loadPlugin(pluginDef: Object): void {
        if (this.plugins.has(pluginDef.name)) {
            throw new Error(`a plugin with name "${pluginDef.name}" is already loaded`);
        }
        const plugin = new Plugin(pluginDef);
        this.plugins.set(plugin.name, new Plugin(pluginDef));
    }

    getPlugin(name: string): Plugin {
        const plugin = this.plugins.get(name);
        if (plugin === undefined) {
            throw new Error(`plugin "${name}" is not loaded`);
        }
        return plugin;
    }

    newPipeline(): Pipeline {
        return new Pipeline(this);
    }
}
