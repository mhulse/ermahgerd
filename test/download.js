const fs = require('fs-extra');
const url = require("url");
const path = require('path');
const axios = require('axios');

const downloadImage = async function(image) {

  const name = url.parse(image);
  let response;

  const writer = fs.createWriteStream(
    path.resolve(__dirname, 'images', path.basename(name.pathname))
  );

  try {
    response = await axios({
      url: image,
      method: 'GET',
      responseType: 'stream', // Axios image download …
    });
    response.data.pipe(writer); // Pipe the result stream directly to a file.
    console.log(response.status, response.headers['content-type']);
  } catch(err) {
    throw err;
  }

  // Return a promise:
  return new Promise((resolve, reject) => {

    writer.on('finish', resolve);
    writer.on('error', reject);

  }).then(() => {
    return response;
  });

};

(async function() {

  const image = await downloadImage('https://user-images.githubusercontent.com/218624/53617906-184bc080-3b9e-11e9-8eaa-ef4a98d8da51.jpg');

  console.log(image);

})()
