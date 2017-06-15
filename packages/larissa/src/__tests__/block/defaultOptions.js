import {createBlock} from '../../../test/utils';

describe('default block options', function () {
    it('should set options that have a default value in the schema', async function () {
        const boolean = createBlock('boolean');
        expect(boolean.options.value).toBe(false);
    });
});
