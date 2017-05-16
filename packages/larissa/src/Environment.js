// @flow
import Pipeline from './Pipeline';
import Plugin from './Plugin';
import builtinBlockTypes from './Blocks/Blocks';
import type {BlockType} from './BlockTypes';

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

    getBlock(name: string) {
        const s = name.split('/');
        let blockType;
        if (s.length === 1) {
            blockType = builtinBlockTypes.getBlock(s[0]);
        } else {
            blockType = this.getPlugin(s[0]).getBlockType(s[1]);
        }
        if (blockType === undefined) {
            throw new Error(`built-in block type "${name}" does not exist`);
        }
        return blockType;
    }

    getBlockList(): Array<Object> {
        let arr = builtinBlockTypes.getBlockList();
        for (let plugin of this.plugins.values()) {
            const blockList = plugin.getBlockList();
            blockList.forEach(block => block.plugin = plugin.name);
            arr = [...arr, ...blockList];
        }
        return arr;
    }
}
