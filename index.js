const parallel = require('async-await-parallel');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const data = require('./test/data.js');

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function downloadImage(image) {

  const writer = fs.createWriteStream(
    path.resolve(__dirname, 'images', `${image.split('=')[1]}.jpg`)
  );

  const response = await axios({
    url: image,
    method: 'GET',
    responseType: 'stream', // Axios image download …
  })

  response.data.pipe(writer); // Pipe the result stream directly to a file.

  // Return a promise:
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })

}

(async function downloadImages() {

  try {
    await parallel(data[0].input.map(image => {
      return async () => {
        await downloadImage(image);
        console.log(image); // This proves that our parallel works.
        await sleep(2000); // Use this to throttle requests.
      }
    }), 2)
  } catch (err) {
    console.log(err);
  } finally {
    console.log('finally')
  }

})();
