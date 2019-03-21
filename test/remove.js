const PID = require('../index');
const pid = new PID({
  target: './images/'
});

(async () => {

  try {
    await pid.clean();
  } catch (err) {
    console.error(err);
  }

})();
