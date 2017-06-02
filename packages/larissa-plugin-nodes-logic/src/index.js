import not from './blocks/not';
import and from './blocks/and';
import or from './blocks/or';
import xor from './blocks/xor';

export default function () {
    return {
        name: 'logic',
        blocks: [
            not,
            and,
            or,
            xor
        ]
    };
}
