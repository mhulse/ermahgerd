const parallel = require('async-await-parallel');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const defaults = {
  throttle: 2, // seconds
  concurrency: 5,
};

const PID = (function() {

  // Non-blocking sleep/throttle:
  const _sleep = async function(milliseconds) {

    return new Promise(resolve => setTimeout(resolve, milliseconds));

  };

  const _downloadImage = async function(image) {

    const writer = fs.createWriteStream(
      path.resolve(__dirname, 'images', `${image.split('=')[1]}.jpg`)
    );

    try {
      const response = await axios({
        url: image,
        method: 'GET',
        responseType: 'stream', // Axios image download …
      });
    } catch(err) {
      throw err;
    }

    response.data.pipe(writer); // Pipe the result stream directly to a file.

    // Return a promise:
    return new Promise((resolve, reject) => {

      writer
        .on('finish', resolve)
        .on('error', reject);

    })

  };

  const _parallelImageMapper = function(image) {

    return async () => {

      // try {
      //   await _downloadImage(image);
      // } catch(err) {
      //   throw err;
      // }

      if (typeof image == 'string') {

        console.log('image', image); // This proves that our parallel works.

      }

      // try {
      //   await sleep(this.options.throttle * 1000); // Use this to throttle requests.
      // } catch(err) {
      //   throw err;
      // }

    }

  };

  const _validateOptions = function() {

    const o = this.options;

    if ( ! Object.entries(o.images).length) {

      throw new Error('options.images is required');

    }

  };

  const _ensureDestination = async function(destination = '') {

    if (destination.length) {

      try {
        await fs.ensureDir(destination);
      } catch(err) {
        throw err;
      }

    }

  }

  const _downloadImages = async function() {

    const o = this.options;

    try {
      await parallel(
        o.images.map(
          _parallelImageMapper
        ),
        o.concurrency
      );
    } catch (err) {
      throw err;
    }

  };

  // Public class API:
  class ParallelImageDownloader {

    constructor(options) {

      // Create a new shallow copy using Object Spread Params (last one in wins):
      this.options = {
        ... defaults,
        ... options,
      };

      _validateOptions.call(this);

    }

    async download() {

      try {
        await _ensureDestination.call(this);
      } catch(err) {
        throw err;
      }

      try {
        await _downloadImages.call(this);
      } catch(err) {
        throw err;
      }

    }

  };

  return ParallelImageDownloader;

}());

// This allows for:
// const x = require()({…}); x.foo();
// … OR:
// const x = require(); x({…}).foo();
module.exports = ((options = {}) => {

  return new PID(options);

});
