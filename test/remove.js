const pid = require('../index')({
  target: './images/'
});

(async () => {

  try {
    await pid.clean();
  } catch (err) {
    console.error(err);
  }

})();
