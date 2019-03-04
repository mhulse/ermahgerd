const data = require('./data');
const pid = require('../index')({
  throttle: 5,
  concurrency: 2,
  target: './images/',
});

(async () => {

  console.log('');
  console.log('1. Single image as string:');
  console.log('');

  try {
    await pid.download(data[0]);
  } catch(err) {
    console.log(err);
  }

  //----------------------------------------------------------------------------

  console.log('');
  console.log('2. Array of images, as strings or objects:');
  console.log('');

  try {
    await pid.update({
      target: './images/2/',
    }).download(data);
  } catch(err) {
    console.log(err);
  }

  //----------------------------------------------------------------------------

  console.log('');
  console.log('3. Single image as object literal:');
  console.log('');

  try {
    await pid.update({
      target: './images/3/'
    }).download(data[1]);
  } catch(err) {
    console.log(err);
  }

  //----------------------------------------------------------------------------

  console.log('');
  console.log('4. Multiple images as string, array and object literal (method args):');
  console.log('');

  try {
    await pid.update({
      target: './images/4/'
    }).download(data[0], data[1], data[2], data[3], data[4]);
  } catch(err) {
    console.log(err);
  }

})()
