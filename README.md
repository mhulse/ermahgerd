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

This example shows how to download two images with no rate or concurrency limiting (module defaults):

```js
const pid = require('parallel-image-downloader')({
  target: './images/',
  debug: 1,
  // Options passed here can be overridden using `update()` method.
});

(async () => {
  try {
    const result = await pid.download(
      'https://i.pinimg.com/originals/d7/59/10/d759105cf6f5823d1b676ec5b787ceef.jpg',
      'https://i.pinimg.com/originals/d7/59/10/does-not-exist.jpg'
    );
    console.log(result);
  } catch (err) {
    console.error(err);
  }
})();

// [
//   [{
//       status: 200,
//       statusText: 'OK',
//       headers: {
//         etag: '"d29cb444664cbe8120893e1339e650ff"',
//         'accept-ranges': 'bytes',
//         'content-type': 'image/jpeg',
//         'content-length': '49772',
//         connection: 'close',
//         vary: 'Origin',
//         'cache-control': 'immutable, max-age=31536000',
//         'x-cdn': 'akamai'
//       },
//       path: 'images/d759105cf6f5823d1b676ec5b787ceef.jpg',
//       image: < Buffer ff d8 ff e0 00 10 4 a 46 49 46 00 01 01 01 00 48 00 48 00 00 ff db 00 43 00 06 04 05 06 05 04 06 06 05 06 07 07 06 08 0 a 10 0 a 0 a 09 09 0 a 14 0e 0 f 0 c...49722 more bytes > ,
//       url: 'https://i.pinimg.com/originals/d7/59/10/d759105cf6f5823d1b676ec5b787ceef.jpg'
//     },
//     {
//       status: 403,
//       statusText: 'Forbidden',
//       headers: {
//         'content-type': 'application/xml',
//         'content-length': '243',
//         connection: 'close',
//         vary: 'Origin',
//         'x-cdn': 'akamai'
//       },
//       path: 'images/does-not-exist.jpg',
//       image: < Buffer 3 c 3 f 78 6 d 6 c 20 76 65 72 73 69 6 f 6e 3 d 22 31 2e 30 22 20 65 6e 63 6 f 64 69 6e 67 3 d 22 55 54 46 2 d 38 22 3 f 3e 0 a 3 c 45 72 72 6 f 72 3e 3 c 43 6 f 64...193 more bytes > ,
//       url: 'https://i.pinimg.com/originals/d7/59/10/does-not-exist.jpg'
//     }
//   ]
// ]
```

For more examples, check out [`example.js`](./test/example.js).

## API

- `download()`: Downloads images; pass array (which may contain nested arrays/objects) or one or more strings
- `update()`: Updates existing options
- `clean()`: Deletes downloaded images

## Options

This module utilizes the features of these modules:

### [`p-ratelimit`](https://github.com/natesilva/p-ratelimit) 

Currently supported options:

option | default | description
--- | --- | ---
`interval` | `undefined` | the interval over which to apply the rate limit, **in seconds**
`rate` | `undefined` | number of API calls per interval
`concurrency` | `undefined` | number of downloads running at once
`maxDelay` | `0` (no timeout) | the maximum amount of time to wait, **in seconds**, before rejecting an API request

**Tips:**

> - specify interval and rate for rate limiting
> - specify concurrency for concurrency limiting
> - specify both if you need both rate and concurrency limits

For example, this:

```js
{
  interval: 10,
  rate: 2,
  concurrency: 2,
}
```

… will download two images in a 10 second period.

### [`axios`](https://github.com/axios/axios)

Currently support options:

option | default | description
--- | --- | ---
`headers` | `{}` | custom HTTP headers to be sent with each image download request.
`maxRedirects` | `5` | the maximum number of redirects to follow (`0` = no redirects followed)
`timeout` | `0` | the number of milliseconds before the request times out (`0` = no timeout)

### Other options

option | default | description
--- | --- | ---
`debug` | `false` | show `console.log()` statements?

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
