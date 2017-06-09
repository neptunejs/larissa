// @flow
import BlockTypes from '../BlockTypes';
const blockTypes = new BlockTypes('');
export default blockTypes;

import boolean from './boolean';
import string from './string';
import identity from './identity';
import jsonParse from './json-parse';
import request from './request';
import csvParse from './csv-parse';
import tableFilter from './table-filter';
import tableMerge from './table-merge';

blockTypes.addBlock(boolean);
blockTypes.addBlock(string);
blockTypes.addBlock(identity);
blockTypes.addBlock(jsonParse);
blockTypes.addBlock(request);
blockTypes.addBlock(csvParse);
blockTypes.addBlock(tableFilter);
blockTypes.addBlock(tableMerge);

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
