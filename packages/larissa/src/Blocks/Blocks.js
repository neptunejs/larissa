// @flow
import rng from './rng';
import sum from './sum';
import number from './number';

import BlockTypes from '../BlockTypes';

const blockTypes = new BlockTypes();

export default blockTypes;

blockTypes.addBlock(rng);
blockTypes.addBlock(sum);
blockTypes.addBlock(number);
