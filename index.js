const { pRateLimit } = require('p-ratelimit');
const { downloadImage, util } = require('./lib/index');

module.exports = (function() {

  const defaults = {
    interval: undefined,
    rate: undefined,
    concurrency: undefined,
    maxDelay: 0,
    debug: false,
    headers: {},
    maxRedirects: 5,
    timeout: 0,
    rename: util.noop,
  };

  const _prepImage = async function(image) {

    const o = this.options;
    const result = {};

    let url;
    let target;
    let name;

    if (util.isObject(image)) {

      if ( ! image.url)
        throw new Error(`Image url missing from object, got: \`${image}\``);

      if ( ! image.name)
        throw new Error(`Image name missing form object, got: \`${image}\``)

      url = image.url;
      name = image.name;

      // Override option’s target directory?
      if (image.target) {

        target = image.target;

        try {
          await util.makeDir(target);
        } catch (err) {
          throw new Error(`Unable to resolve target, got: \`${target}\``);
        }

      }

    } else {

      url = image;
      name = util.urlFileName(url);

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

        return downloadImage({
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
      this.options = {
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

      if ( ! images.length)
        throw new TypeError(`One or more images are required, got: \`${images}\``);

      if ( ! o.target)
        throw new TypeError(`Target directory required, got: \`${o.target}\``);

      const target = await util.makeDir(o.target);

      if ( ! target)
        throw new Error(`Target directory not found or created, got: \`${target}\``);

      return _downloadImages.call(this, images);

    }

    // Clean up (remove) downloaded images …
    async clean() {

      const o = this.options;

      if ( ! o.target)
        throw new TypeError(`Target directory required, got: \`${o.target}\``);

      const removed = await util.removeDir(o.target);

      if ( ! removed)
        console.error('Target directory not removed!');

    }

  }

  return ParallelImageDownloader;

})();
