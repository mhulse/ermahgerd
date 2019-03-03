const data = require('./data');
const pid = require('./index');

(async () => {

  try {
    await pid({
      throttle: 5,
      concurrency: 2,
      images: data,
      destination: './images/',
    }).download();
  } catch(err) {
    console.log(err);
  }

})()
