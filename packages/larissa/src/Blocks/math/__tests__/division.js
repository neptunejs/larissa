import {checkBlock} from 'test/utils';

describe('division block', () => {
    it('should divide terms', () => {
        expect.assertions(1);
        return checkBlock('division', {
            dividend: 10,
            divisor: 2
        }, 5);
    });

    it('should error on wrong values', () => {
        return expect(checkBlock('division', {
            dividend: 0,
            divisor: 0
        }, 5)).rejects.toEqual(Error('division failed'));
    });
});
