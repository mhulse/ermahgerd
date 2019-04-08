const PID = require('../index');
const pid = new PID({
  debug: true,
  target: './images/',
});

(async () => {
  try {
    const result = await pid.download(
      'https://i.pinimg.com/originals/d7/59/10/d759105cf6f5823d1b676ec5b787ceef.jpg',
      'https://i.pinimg.com/originals/d7/59/10/does-not-exist.jpg'
    );
    console.log(result);
  } catch (err) {
    console.error(err);
  }
})();
