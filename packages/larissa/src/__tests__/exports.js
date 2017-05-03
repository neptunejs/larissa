import {Environment} from '../index';

import Env from '../Environment';

describe('module exports', () => {
    it('correct values should be exported', () => {
        expect(Environment).toEqual(Env);
    });
});