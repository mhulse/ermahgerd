const fs = require('fs-extra');
const path = require('path');
const url = require('url');
const axios = require('axios');

const util = {

  downloadImage: async (url, target, options = {}) => {

    const defaults = {
      url: url,
      method: 'GET',
      responseType: 'arraybuffer',
    };
    let res;

    // @TODO https://github.com/axios/axios#handling-errors
    await axios({
      ... defaults,
      ... options,
    }).then(response => {

      res = response;

    }).catch((err) => {

      if (err.response) {

        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx:
        res = err.response;

      } else if (err.request) {

        // The request was made but no response was received:
        console.error(err.request);

      } else {

        // Something happened in setting up the request that triggered an Error:
        console.error(err.message);

      }
    });

    if (res && (res.status === 200 || res.status === 201)) {

      await fs.outputFile(target, res.data);

    }

    // Return data to callee:
    return (res ? {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      path: target,
      image: res.data,
      url: res.request.res.responseUrl,
    } : {}); // Empty object if all else fails.

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

  throwErr: (message = '', code = 'Error') => {

    const codes = {
      'Error': Error,
      'RangeError': RangeError,
      'ReferenceError': ReferenceError,
      'SyntaxError': SyntaxError,
      'TypeError': TypeError,
    };

    throw new codes[code](message);

  },

};

module.exports = util;
