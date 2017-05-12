// @flow
import BlockTypes from '../BlockTypes';
const blockTypes = new BlockTypes();
export default blockTypes;

import string from './string';
import jsonParse from './json-parse';
blockTypes.addBlock(string);
blockTypes.addBlock(jsonParse);

import number from './math/number';
import rng from './math/rng';
import sum from './math/sum';
import product from './math/product';
import division from './math/division';
import subtraction from './math/subtraction';

blockTypes.addBlock(number);
blockTypes.addBlock(rng);
blockTypes.addBlock(sum);
blockTypes.addBlock(product);
blockTypes.addBlock(division);
blockTypes.addBlock(subtraction);
