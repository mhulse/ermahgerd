const data = require('./data');
const PID = require('../index');
const util = require('../lib/util');

(async () => {

  const options = {
    interval: 10,
    rate: 2,
    concurrency: 2,
    target: './images/',
    debug: true,
  };

  const pid = new PID(options);

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

    console.log(result);

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

    console.log(result);

  } catch (err) {

    console.error(err);

  }

  //----------------------------------------------------------------------------

  console.log('');
  console.log('4. Single image as object, with file rename:');
  console.log('');

  // Testing new instance:
  const pid2 = new PID(options);

  try {

    const result = await pid2.update({
      rename: async file => {

        const name = util.urlFileName(file);
        const parts = name.split('-');
        const x = parts[0].replace(/\D/g, '').padStart(2, '0');
        const y = parts[1].replace(/\D/g, '').padStart(2, '0');

        return file.replace(name, `tile_y${y}-x${x}`);

      },
    }).download(data[7]);

    console.log(result);

  } catch (err) {

    console.error(err);

  }

  //----------------------------------------------------------------------------

  console.log('');
  console.log('5. Multiple images as object, with different file renames:');
  console.log('');

  // Testing new instance:
  const pid3 = new PID(options);

  try {

    const result = await pid3.update({
      rename: async file => {

        const name = util.urlFileName(file);
        const parsed = util.getUrlParts(file, true);
        let x;
        let y;

        if (parsed.search) {

          x = parsed.query.x;
          y = parsed.query.y;

        } else {

          const parts = file.split('=')[1].split('-');

          x = parts[0].replace(/\D/g, '');
          y = parts[1].replace(/\D/g, '');

        }

        x = x.padStart(2, '0');
        y = y.padStart(2, '0');

        return file.replace(name, `tile_y${y}-x${x}`);

      },
    }).download(data[8]);

    console.log(result);

  } catch (err) {

    console.error(err);

  }

  //----------------------------------------------------------------------------

  console.log('');
  console.log('6. Multiple images as string, array and object literal (method args):');
  console.log('');

  try {

    // Also an example of NOT waiting for the async to finsih:
    pid
      .update({
        target: './images/5/'
      })
      .download(data[0], data[1], data[2], data[3], data[4])
      .then(result => {

        console.log(result);

      });

  } catch (err) {

    console.error(err);

  }

  // This will get logged before the above promise finishes:
  console.log('this is something else');

})()
