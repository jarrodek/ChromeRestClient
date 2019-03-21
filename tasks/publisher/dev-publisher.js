const {PublisherBase} = require('./publisher-base');
class DevPublisher extends PublisherBase {
  constructor(bundleFile) {
    super({
      id: 'okeafnfmgoafdfbcjkanpgmjanccpell',
      audience: 'trustedTesters',
      bundleFile
    });
  }
}
module.exports.DevPublisher = DevPublisher;
