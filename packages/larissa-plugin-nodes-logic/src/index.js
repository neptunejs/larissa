import not from './blocks/not';
import and from './blocks/and';
import or from './blocks/or';
import xor from './blocks/xor';
import fourBitsNumber from './blocks/4-bits-number';
import number4Bits from './blocks/number-4-bits';

export default function () {
    return {
        name: 'logic',
        blocks: [
            not,
            and,
            or,
            xor,
            fourBitsNumber,
            number4Bits
        ]
    };
}
