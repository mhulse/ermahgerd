module.exports = {

    // Non-blocking sleep/throttle:
  sleep: (milliseconds) => {

    return new Promise(resolve => setTimeout(resolve, milliseconds));

  },

  makeDir: async (destination = '') => {

    if (destination.length) {

      try {
        await fs.ensureDir(destination);
      } catch(err) {
        throw err;
      }

    }

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

}
