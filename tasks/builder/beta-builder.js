const {ArcBuilder} = require('./arc-builder.js');

class BetaBuilder extends ArcBuilder {
  constructor() {
    super();
    this.channel = 'beta';
  }
}

new BetaBuilder().build();
