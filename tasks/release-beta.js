const {BetaBuilder} = require('./builder/beta-builder.js');
const {BetaPublisher} = require('./publisher/beta-publisher.js');

class DevRelease {
  constructor() {
    try {
      this.builder = new BetaBuilder();
      this.publisher = new BetaPublisher();
    } catch (e) {
      console.error(e);
      process.exit(-1);
    }
  }

  release() {
    console.log('Releasing ARC (Chrome) - beta channel.');
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
