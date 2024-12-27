const inspector = require('inspector');
const session = new inspector.Session();
session.connect();
session.post('Profiler.enable');
session.post('Profiler.start');

session.post('Profiler.stop', (err, { profile }) => {
  console.log(profile);
});
