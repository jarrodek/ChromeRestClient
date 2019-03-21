const {PublisherBase} = require('./publisher-base');
class StablePublisher extends PublisherBase {
  constructor(bundleFile) {
    super({
      id: 'hgmloofddffdnphfgcellkdfbfbjeloo',
      audience: 'default',
      bundleFile
    });
  }
}
module.exports.StablePublisher = StablePublisher;
