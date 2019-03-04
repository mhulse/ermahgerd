const parallel = require('async-await-parallel');
const util = require('./lib/util');

const defaults = {
  throttle: 2, // Seconds to throttle between concurrent downloads.
  concurrency: 5, // Number of images to download at one time.
  debug: false, // @TODO: https://github.com/mhulse/parallel-image-downloader/issues/2
};

const PID = (function() {

  const _prepImage = async function(image) {

    const o = this.options;
    const result = {};

    let url;
    let target;
    let name;

    if (util.isObject(image)) {

      if (image.url) {

        url = image.url;

      } else {

        throw new Error(`image url missing from object: ${image}`);

      }

      if (image.name) {

        name = image.name;

      }

      if (image.target) {

        target = image.target;

        try {

          await util.makeDir(target);

        } catch (err) {

          throw new Error(`unable to resolve target: ${target}`);

        }

      }

    } else {

      url = image;

      name = util.fileName(url);

    }

    result.url = url;

    result.target = util.joinPaths((target || o.target), name);

    return result;

  }

  const _parallelImageMapper = function(image) {

    const o = this.options;

    return async () => {

      const parsed = await _prepImage.call(this, image);

      await util.downloadImage(parsed.url, parsed.target);

      // This output shows that our parallel works:
      // console.log(`-------------------- (${o.throttle * 1000})`);

      if (o.throttle) {

        // Use this to throttle requests:
        await util.sleep(o.throttle * 1000);

      }

    }

  };

  const _downloadImages = async function(images) {

    const o = this.options;

    await parallel(
      images.map(
        _parallelImageMapper,
        this // Pass context.
      ),
      o.concurrency
    );

  };

  // Public class API:
  class ParallelImageDownloader {

    constructor(options) {

      this.update(options);

    }

    // Allows us to update options after instantiation:
    update(options) {

      // Create a new shallow copy using Object Spread Params (last one in wins):
      this.options = {
        ... defaults,
        ... this.options,
        ... options,
      };

      return this;

    }

    async download(... images) {

      let o = this.options;

      // We really just want one array:
      images = util.flattenDeep(images);

      if (images.length) {

        if (o.target) {

          const target = await util.makeDir(o.target);

          if (target) {

            await _downloadImages.call(this, images);

          } else {

            throw new Error('target not found or created');

          }

        } else {

          throw new Error('target required');

        }

      } else {

        throw new Error('one or more images are required');

      }

    }

    // Clean up (remove) downloaded images …
    async clean() {

      let o = this.options;

      if (o.target) {

        const removed = await util.removeDir(o.target);

        if ( ! removed) {

          throw new Error('target not removed');

        }

      } else {

        throw new Error('target required');

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
