# parallel-image-downloader

**Node.js parallel image(s) downloader.**

## Features

- Rate and/or concurrency limiting
- One or multiple images
- Flexible method API

## Installation

```bash
$ npm i mhulse/parallel-image-downloader
```

## Usage

```js
const pid = require('../index')({
  target: './images/',
  debug: 1,
  // Options passed here can be overridden using `update()` method.
});

(async () => {
  try {
    const result = await pid.download('https://i.pinimg.com/originals/d7/59/10/d759105cf6f5823d1b676ec5b787ceef.jpg');
    console.log(result);
  } catch (err) {
    console.error(err);
  }
})();

// [index.js:88:17] 0 https://i.pinimg.com/originals/d7/59/10/d759105cf6f5823d1b676ec5b787ceef.jpg
// [ [ { status: 200,
//   statusText: 'OK',
//   headers: [Object],
//   config: [Object],
//   request: [ClientRequest],
//   data: [IncomingMessage] } ] ]
```

For more examples, check out [`example.js`](./test/example.js).

## API

- `download()`: Downloads images; pass array (which may contain nested arrays/objects) or one or more strings
- `update()`: Update’s existing options
- `clean()`: Deletes downloaded images

## Options

This module utilizes the features of these modules:

### [`p-ratelimit`](https://github.com/natesilva/p-ratelimit)  

- `interval`: `undefined` the interval over which to apply the rate limit, **in seconds**
- `rate`: `undefined`, number of API calls per interval
- `concurrency`: `undefined`, number of downloads running at once
- `maxDelay`: `0` (no timeout), the maximum amount of time to wait, **in seconds**, before rejecting an API request

**Tips:**

> - specify interval and rate for rate limiting
> - specify concurrency for concurrency limiting
> - specify both if you need both rate and concurrency limits

For example, this:

```js
{
  interval: 10000,
  rate: 2,
  concurrency: 2,
}
```

… will download two images in a 10 second period.

### [`axios`](https://github.com/axios/axios)

- `headers`: `{}`, custom HTTP headers to be sent with each image download request.
- `maxRedirects`: `5`, the maximum number of redirects to follow (`0` = no redirects followed)
- `timeout`: `0`, the number of milliseconds before the request times out (`0` = no timeout)

### Other options

- `debug`: `false`, show `console.log()` statements?

## Development

Clone this repo, then:

```bash
$ npm install
```

Run test(s):

```bash
$ npm test
```

Experiment with test code:

```bash
$ node ./test/example.js
```

## License

Copyright © 2019 [Michael Hulse](http://mky.io).

Licensed under the Apache License, Version 2.0 (the “License”); you may not use this work except in compliance with the License. You may obtain a copy of the License in the LICENSE file, or at:

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
