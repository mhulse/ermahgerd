const parallel = require('async-await-parallel');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const data = require('./test/data.js');

async function downloadImage(image) {

  const writer = fs.createWriteStream(
    path.resolve(__dirname, 'images', `${image.split('=')[1]}.jpg`)
  );

  const response = await axios({
    url: image,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })

}

const promiseArray = data[0].input.map(image => {
  return async () => {
    try {
      downloadImage(image)
    } catch (err) {
      throw 'der'
    }
  };
});

(async function downloadImages() {

  try {
    await parallel(promiseArray, 2)
  } catch (err) {
    console.log(err);
  }

})();
