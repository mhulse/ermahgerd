const parallel = require('async-await-parallel');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const util = require('./util');

const defaults = {
  throttle: 2, // seconds
  concurrency: 5,
};

const PID = (function() {

  const _downloadImage = async function(image) {

    let response;

    const writer = fs.createWriteStream(
      path.resolve(__dirname, 'images', `${image.split('=')[1]}.jpg`)
    );

    try {
      response = await axios({
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

    }).then(() => {
      return response;
    })

  };

  const _parallelImageMapper = function(image) {

    return async () => {

      // try {
      //   await _downloadImage(image);
      // } catch(err) {
      //   throw err;
      // }

      console.log('image', image); // This proves that our parallel works.

      // try {
      //   await util.sleep(this.options.throttle * 1000); // Use this to throttle requests.
      // } catch(err) {
      //   throw err;
      // }

    }

  };

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

    }

    async download(images) {

      if (util.isString(images)) {

        console.log('do something with string');

      } else if (util.isArray(images)) {

        console.log('do something with array');

      } else if (util.isObject(images)) {

        console.log('do something with object');

      }

      if (true) {

        // if (this.options.destination) {
        //
        //   try {
        //     await _ensureDestination(destination);
        //   } catch(err) {
        //     throw err;
        //   }
        //
        // }
        //
        // try {
        //   await _downloadImages.call(this);
        // } catch(err) {
        //   throw err;
        // }

      } else {

        throw new Error('options.images is required');

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
