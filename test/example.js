const data = require('./data');
const pid = require('../index')({
  interval: 10,
  rate: 2,
  concurrency: 2,
  target: './images/',
  debug: true,
});

(async () => {

  console.log('');
  console.log('1. Single image as string:');
  console.log('');

  try {

    const result = await pid.download(data[0]);

    console.log(result);

  } catch (err) {

    console.error(err);

  }

  //----------------------------------------------------------------------------

  console.log('');
  console.log('2. Array of images, as strings or objects:');
  console.log('');

  try {

    const result = await pid.update({
      target: './images/2/',
      debug: true,
    }).download(data);

    // console.log(result);

  } catch (err) {

    console.error(err);

  }

  //----------------------------------------------------------------------------

  console.log('');
  console.log('3. Single image as object literal:');
  console.log('');

  try {

    const result = await pid.update({
      target: './images/3/'
    }).download(data[1]);

    // console.log(result);

  } catch (err) {

    console.error(err);

  }

  //----------------------------------------------------------------------------

  console.log('');
  console.log('4. Multiple images as string, array and object literal (method args):');
  console.log('');

  try {

    pid
      .update({
        target: './images/4/'
      })
      .download(data[0], data[1], data[2], data[3], data[4])
      .then(result => {

        console.log('-----------------------------------------------------');
        console.log(result);

      });

  } catch (err) {

    console.error(err);

  }

  // @TODO Make better example of code that can execute while we wait for `.then()`:
  console.log('this is something else');

})()
