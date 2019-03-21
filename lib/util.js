const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const untildify = require('untildify');
const url = require('url');

const util = {

  downloadImage: async (o = {}) => {

    let res;

    if (o.url && o.target) {

      const defaults = {
        url: o.url,
        method: 'GET',
        responseType: 'arraybuffer',
      };

      o.target = util.resolvePath(o.target);

      try {

        res = await axios({
          ... defaults,
          ... o.http,
        });

      } catch (err) {

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

      }

      if (res && ((res.status === 200) || (res.status === 201))) {

        o.target = (await o.rename(o.target) || o.target);

        await util.writeFile(o.target, res.data);

      }

    }

    // Return data to callee:
    return (res ? {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      path: o.target,
      image: res.data,
      url: res.request.res.responseUrl,
    } : {
      // Mock object if all else fails:
      status: -1,
      path: o.target,
      url: url,
    });

  },

  writeFile: async (target = '', file) => {

    let result = false;

    if (target && file) {

      try {

        await fs.outputFile(target, file);

        result = true;

      } catch (err) {

        console.error(err);

        result = false;

      }

    }

    return result;

  },

  joinPaths: (... paths) => {

    return path.join(... paths);

  },

  resolvePath: (target) => {

    return path.resolve(untildify(target));

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

      target = util.resolvePath(target);

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

      target = path.resolve(untildify(target));

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

  isObject: (obj) => {

    return (
      obj
      &&
      (obj instanceof Object)
      &&
      ( ! util.isArray(obj))
      &&
      Object.entries(obj).length
    );

  },

  flattenDeep: (arr) => {

    return arr.reduce((acc, val) => util.isArray(val) ? acc.concat(util.flattenDeep(val)) : acc.concat(val), []);

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

  noop: () => {},

};

module.exports = util;
