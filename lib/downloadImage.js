const axios = require('axios');
const util = require('./util');

module.exports = async (o = {}) => {

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
        ...defaults,
        ...o.http,
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

      let rename;

      try {
        rename = await o.rename(o.target);
      } catch (err) {
        throw new Error(`Could not rename image, got: \`${o.target}\``);
      }

      o.target = (rename || o.target);

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
      url: o.url,
    });

};
