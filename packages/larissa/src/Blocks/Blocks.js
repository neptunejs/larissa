// @flow
import rng from './rng';
import sum from './sum';
import number from './number';
import string from './string';
import jsonParse from './json-parse';

import BlockTypes from '../BlockTypes';

const blockTypes = new BlockTypes();

export default blockTypes;

blockTypes.addBlock(rng);
blockTypes.addBlock(sum);
blockTypes.addBlock(number);
blockTypes.addBlock(string);
blockTypes.addBlock(jsonParse);
