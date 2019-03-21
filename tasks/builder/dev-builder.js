const {ArcBuilder} = require('./arc-builder.js');

class DevBuilder extends ArcBuilder {
  constructor() {
    super({
      clientId: '10525470235-9i33503tloq3vq6lc3vtnvu23lhk0mg3.apps.googleusercontent.com',
      channel: 'dev'
    });
  }
}

// new AlphaBuilder().build();
module.exports.DevBuilder = DevBuilder;
