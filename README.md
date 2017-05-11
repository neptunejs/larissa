# larissa

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![npm download][download-image]][download-url]

JavaScript engine for dataflow programming.

## Installation

`$ npm install --save larissa`

## Usage

```js
import {Environment} from 'larissa';

async function runPipeline() {
    const env = new Environment();
    const pipeline = env.newPipeline();

    const number1 = pipeline.newNode('number', {value: 5});
    const number2 = pipeline.newNode('number', {value: 10});
    const sum = pipeline.newNode('sum');

    pipeline.connect(number1, sum);
    pipeline.connect(number2, sum);
    
    // run is always asynchronous
    await pipeline.run();
    const result = sum.output().getValue();
    console.log(result); // 15
}
```

## License

  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/larissa.svg?style=flat-square
[npm-url]: https://npmjs.org/package/larissa
[travis-image]: https://img.shields.io/travis/neptunejs/larissa/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/neptunejs/larissa
[download-image]: https://img.shields.io/npm/dm/larissa.svg?style=flat-square
[download-url]: https://npmjs.org/package/larissa
