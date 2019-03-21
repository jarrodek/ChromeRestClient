const {ArcBuilder} = require('./arc-builder.js');

class BetaBuilder extends ArcBuilder {
  constructor() {
    super({
      clientId: '10525470235-8jdqrmhel42n3cpr5qjib9p683inp93u.apps.googleusercontent.com',
      channel: 'beta'
    });
  }
}

module.exports.BetaBuilder = BetaBuilder;
