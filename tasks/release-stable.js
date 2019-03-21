const {StableBuilder} = require('./builder/stable-builder.js');
const {StablePublisher} = require('./publisher/beta-publisher.js');

class DevRelease {
  constructor() {
    try {
      this.builder = new StableBuilder();
      this.publisher = new StablePublisher();
    } catch (e) {
      console.error(e);
      process.exit(-1);
    }
  }

  release() {
    console.log('Releasing ARC (Chrome) - stable channel.');
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
