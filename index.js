const { pRateLimit } = require('p-ratelimit');
const util = require('./lib/util');

module.exports = (function() {

  const defaults = {
    interval: undefined, // 1000 ms == 1 second
    rate: undefined, // number of API calls per interval
    concurrency: undefined, // number of downloads running at once
    maxDelay: 0, // an API call delayed > 2 sec is rejected
    debug: false, // Show `console.log()`?
    headers: {}, // Custom HTTP headers to be sent with each image download request.
    maxRedirects: 5, // The maximum number of redirects to follow (0 = no redirects followed)
    timeout: 0, // The number of milliseconds before the request times out (0 = no timeout)
    rename: util.noop, // Callback method used to modify the name of downloaded image
  };

  const _prepImage = async function(image) {

    const o = this.options;
    const result = {};

    let url;
    let target;
    let name;

    if (util.isObject(image)) {

      image.url || util.throwErr(`image url missing from object: ${image}`);

      url = image.url;

      if (image.name) {

        name = image.name;

      }

      if (image.target) {

        target = image.target;

        try {

          await util.makeDir(target);

        } catch (err) {

          util.throwErr(`unable to resolve target: ${target}`);

        }

      }

    } else {

      url = image;

      name = util.fileName(url);

    }

    result.url = url;

    result.target = util.joinPaths((target || o.target), name);

    return result;

  };

  const _downloadImages = async function(images) {

    const o = this.options;
    const data = [];
    const limit = pRateLimit({
      interval: (o.interval && (o.interval * 1000)),
      rate: o.rate,
      concurrency: o.concurrency,
      maxDelay: ((o.maxDelay > 0) ? (o.maxDelay * 1000) : o.maxDelay),
    });
    const promises = images.map(async (image, index) => {

      return limit(async () => {

        const parsed = await _prepImage.call(this, image);

        o.debug && console.log(index, image);

        return util.downloadImage({
          url: parsed.url,
          target: parsed.target,
          http: {
            headers: o.headers,
            maxRedirects: o.maxRedirects,
            timeout: o.timeout,
          },
          rename: o.rename,
        });

      });

    });

    await Promise.all(promises).then(result => {

      data.push(result);

    });

    return data;

  };

  // Public class API:
  class ParallelImageDownloader {

    constructor(options) {

      this.update(options);

    }

    // Allows us to update options after instantiation:
    update(options) {

      // Create a new shallow copy using Object Spread Params (last one in wins):
      const o = this.options = {
        ... defaults,
        ... this.options,
        ... options,
      };

      // Return this for chaining purposes:
      return this;

    }

    async download(... images) {

      const o = this.options;

      // We really just want one array:
      images = util.flattenDeep(images);

      images.length || util.throwErr('one or more images are required', 'TypeError');

      o.target || util.throwErr('target directory required', 'TypeError');

      const target = await util.makeDir(o.target);

      target || util.throwErr('target directory not found or created');

      return _downloadImages.call(this, images);

    }

    // Clean up (remove) downloaded images …
    async clean() {

      let o = this.options;

      o.target || util.throwErr('target directory required', 'TypeError');

      const removed = await util.removeDir(o.target);

      removed || util.throwErr('target directory not removed');

    }

  }

  return ParallelImageDownloader;

}());
