const fs = require('fs-extra');
const path = require('path');
const untildify = require('untildify');
const url = require('url');

const util = {

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

  resolvePath: target => {

    return path.resolve(untildify(target));

  },

  getUrlParts: (path, parseQueryString = false) => {

    return url.parse(path, parseQueryString);

  },

  urlFileName: function(file) {

    let result = '';

    try {

      const parsed = this.getUrlParts(file);

      // Some images have query string; we need to keep it:
      result = path.basename([
        parsed.pathname,
        parsed.search,
      ].filter(Boolean).join(''));

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

  isArray: arr => {

    return (arr && Array.isArray(arr) && arr.length);

  },

  isObject: obj => {

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

  flattenDeep: arr => {

    return arr.reduce((acc, val) => util.isArray(val) ? acc.concat(util.flattenDeep(val)) : acc.concat(val), []);

  },

  noop: () => {},

};

module.exports = util;
