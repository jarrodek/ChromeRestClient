const {PublisherBase} = require('./publisher-base');
class BetaPublisher extends PublisherBase {
  constructor(bundleFile) {
    super({
      id: 'epgngalmiadbjnoompchcohonhidjanm',
      audience: 'trustedTesters',
      bundleFile
    });
  }
}
module.exports.BetaPublisher = BetaPublisher;
