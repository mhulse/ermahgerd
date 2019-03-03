const data = require('./data');
const pid = require('./index');

(async () => {

  try {
    await pid({
      throttle: 5,
      concurrency: 2,
      destination: './images/',
    }).download(['https://i.pinimg.com/originals/d7/59/10/d759105cf6f5823d1b676ec5b787ceef.jpg']);
  } catch(err) {
    console.log(err);
  }

})()
