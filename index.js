const parallel = require('async-await-parallel');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const defaults = {
  throttle: 2, // seconds
}

// Non-blocking sleep/throttle:
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function downloadImage(image) {

  const writer = fs.createWriteStream(
    path.resolve(__dirname, 'images', `${image.split('=')[1]}.jpg`)
  );

  const response = await axios({
    url: image,
    method: 'GET',
    responseType: 'stream', // Axios image download …
  })

  response.data.pipe(writer); // Pipe the result stream directly to a file.

  // Return a promise:
  return new Promise((resolve, reject) => {

    writer.on('finish', resolve);

    writer.on('error', reject);

  })

}

async function run(options = {}) {

  // Create a new shallow copy using Object Spread Params (last one in wins):
  const opts = {
    ...defaults,
    ...options,
  };

  try {
    await parallel(data[0].input.map(image => {
      return async () => {
        await downloadImage(image);
        console.log(image); // This proves that our parallel works.
        await sleep(opts.throttle * 1000); // Use this to throttle requests.
      }
    }), 2)
  } catch (err) {
    console.log(err);
  } finally {
    console.log('finally')
  }

});

module.exports = run;
