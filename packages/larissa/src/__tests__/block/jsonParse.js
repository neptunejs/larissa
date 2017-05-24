import {createBlock} from '../../../test/utils';

describe('json-parse block', function () {
    it('run should fail if input is not set', async function () {
        const jsonParse = createBlock('json-parse');
        // TODO: any better way to assert Error instances?
        await expect(jsonParse.run()).rejects.toHaveProperty('message', 'Cannot run node, required input ports do not have values');
    });
});
