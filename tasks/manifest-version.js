//jscs:disable requireCamelCaseOrUpperCaseIdentifiers

const fs = require('fs');
const path = require('path');
/**
 * Class responsible for setting correct version on the manifest file.
 */
class ManifestProcessor {

  constructor(buildPath, channel) {
    this.bowerFile = 'bower.json';
    this.manifestFile = 'manifest.json';
    this.bower = JSON.parse(fs.readFileSync(this.bowerFile, 'utf8'));
    this.buildPath = buildPath;
    this.channel = channel;
  }

  config() {
    if (!this._config) {
      this._config = JSON.parse(fs.readFileSync('./tasks/cws-config.json', 'utf-8'));
    }
    return this._config;
  }

  getManifest() {
    var file = path.join(this.buildPath, this.manifestFile);
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }

  updateManifest() {
    var manifest = this.getManifest();
    this.updateVersion(manifest);
    this.updateName(manifest);
    this.updateKeys(manifest);
    this.saveManifest(manifest);
  }

  updateVersion(manifest) {
    var version = this.bower.version;
    var versionName = version + '-' + this.channel;
    manifest.version = version;
    manifest.version_name = versionName;
  }

  updateName(manifest) {
    switch (this.channel) {
      case 'canary':
      case 'dev':
      case 'beta':
        manifest.name += '-' + this.channel;
        manifest.short_name += '-' + this.channel;
        return;
    }
  }

  updateKeys(manifest) {
    var config = this.config();
    manifest.oauth2.client_id = config[this.channel].clientId;
    delete manifest.key;
  }

  saveManifest(manifest) {
    var file = path.join(this.buildPath, this.manifestFile);
    manifest = JSON.stringify(manifest, null, 2);
    return fs.writeFileSync(file, manifest, 'utf8');
  }
}

module.exports.ManifestProcessor = ManifestProcessor;
