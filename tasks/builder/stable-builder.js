const {ArcBuilder} = require('./arc-builder.js');

class StableBuilder extends ArcBuilder {
  constructor() {
    super({
      clientId: '10525470235-vtm8ckt9v43r1gbbjqhp01tnnr0ol41j.apps.googleusercontent.com',
      channel: 'stable'
    });
  }
}

module.exports.StableBuilder = StableBuilder;
