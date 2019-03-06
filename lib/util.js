const fs = require('fs-extra');
const path = require('path');
const url = require('url');
const axios = require('axios');

const util = {

  downloadImage: async (url, target, options = {}) => {

    const writer = fs.createWriteStream(target);
    const defaults = {
      url: url,
      method: 'GET',
      responseType: 'stream', // Axios image download …
    };
    const response = await axios({
      ... defaults,
      ... options,
    });

    // Pipe the result stream directly to a file:
    response.data.pipe(writer);

    // Return a promise:
    return new Promise((resolve, reject) => {

      writer
        .on('finish', resolve)
        .on('error', reject);

    }).then(() => {

      // This gives the callee access to the response headers:
      return response;

    });

  },

  joinPaths: (... paths) => {

    return path.join(... paths);

  },

  fileName: (file) => {

    let result = '';

    try {

      result = path.basename(url.parse(file).pathname);

    } catch (err) {

      result = '';

    }

    return result;

  },

  removeDir: async (target = '') => {

    let result = false;

    if (target.length) {

      try {

        await fs.remove(target);

        result = true;

      } catch (err) {

        console.error(err);

        result = false;

      }

    }

    return result;

  },

  // Returns boolean:
  makeDir: async (target = '') => {

    let result = false;

    if (target.length) {

      try {

        await fs.ensureDir(target);

        result = true;

      } catch (err) {

        console.error(err);

        result = false;

      }

    }

    return result;

  },

  isArray: (arr) => {

    return (arr && Array.isArray(arr) && arr.length);

  },

  isString: (str) => {

    return (str && (typeof str == 'string') && str.length);

  },

  isObject: (obj) => {

    return (
      obj
      &&
      (obj instanceof Object)
      &&
      ( ! Array.isArray(obj))
      &&
      Object.entries(obj).length
    );

  },

  flattenDeep: (arr) => {

    return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(util.flattenDeep(val)) : acc.concat(val), []);

  },

  throwErr: (message) => {

    throw new Error(message);

  },

};

module.exports = util;
