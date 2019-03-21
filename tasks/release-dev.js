const {DevBuilder} = require('./builder/dev-builder.js');
const {DevPublisher} = require('./publisher/dev-publisher.js');

class DevRelease {
  constructor() {
    try {
      this.builder = new DevBuilder();
      this.publisher = new DevPublisher();
    } catch (e) {
      console.error(e);
      process.exit(-1);
    }
  }

  release() {
    console.log('Releasing ARC (Chrome) - dev channel.');
    return this.builder.build()
    .then((bundleFile) => {
      console.log('Bundle ready. Publishing...');
      return this.publisher.publish(bundleFile);
    })
    .then(() => {
      console.log('The app is now published.');
    })
    .catch((cause) => {
      console.error(cause);
      process.exit(-1);
    });
  }
}

new DevRelease().release();
