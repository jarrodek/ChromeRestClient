const fs = require('fs');
/**
 * ARC version numbers consist of 4 parts: MAJOR.MINOR.BUILD.PATCH.
 * - MAJOR must get updated with every release
 * - MINOR must get updated with every hotfix release
 * - BUILD must get updated whenever a release candidate is built from the develop trunk
 *   (at least weekly for Dev channel release candidates).
 *   The BUILD number is an ever-increasing number representing a point in time of the trunk.
 * - PATCH must get updated whenever a release candidate is built from the FEATURE branch.
 */
var Bump = {
  manifest: './app/manifest.json',
  bower: './bower.json',
  package: './package.json',
  getPackage: () => {
    return JSON.parse(fs.readFileSync(Bump.package, 'utf8'));
  },
  getBower: () => {
    return JSON.parse(fs.readFileSync(Bump.bower, 'utf8'));
  },
  getManifest: () => {
    return JSON.parse(fs.readFileSync(Bump.manifest, 'utf8'));
  },
  setPackage: (packageContent) => {
    packageContent = JSON.stringify(packageContent, null, 2);
    return fs.writeFileSync(Bump.package, packageContent, 'utf8');
    // console.log(packageContent);
  },
  setBower: (bower) => {
    bower = JSON.stringify(bower, null, 2);
    return fs.writeFileSync(Bump.bower, bower, 'utf8');
    // console.log(bower);
  },
  setManifest: (manifest) => {
    manifest = JSON.stringify(manifest, null, 2);
    return fs.writeFileSync(Bump.manifest, manifest, 'utf8');
    // console.log(manifest);
  },
  /**
   * Bump the version in bower.json, package.json and manifest.json.
   *
   * @param {Object} options An options to pass.
   * - {String} target A build target: 'canary', 'dev', 'beta-release', 'beta-hotfix', 'stable',
   * 'hotfix'
   * For `canary` release (daily build) the PATCH number will increase.
   * For `dev` release (weekly build) the BUILD number will increase.
   * For `beta-release` release  will increase the MAJOR and MINOR will be set to 0.
   * for `beta-hotfix` release (where hotfix is applied to the beta) MINOR version will increase
   * For `stable` release the MINOR number will be set to 0.
   * For `hotfix` release the MINOR number will increase.
   */
  bump: (options) => {
    var manifest = Bump.getManifest();
    var version = '0.0.0.0';
    var versionName = 'stable';
    if (manifest && manifest.version) {
      version = manifest.version;
    }
    var parts = version.split('.');
    version = [0, 0, 0, 0];
    parts.forEach((no, i) => {
      no = Number(no);
      if (no !== no) {
        no = 0;
      }
      version[i] = no;
    });
    switch (options.target) {
      case 'canary':
        version = Bump._bumpCanary(version);
        versionName = 'canary';
        break;
      case 'dev':
        version = Bump._bumpDev(version);
        versionName = 'dev';
        break;
      case 'beta-release':
        version = Bump._bumpBetaRelease(version);
        versionName = 'beta';
        break;
      case 'beta-hotfix':
        version = Bump._bumpBetaHotfix(version);
        versionName = 'beta';
        break;
      case 'stable-release':
        version = Bump._bumpStable(version);
        break;
      case 'stable-hotfix':
        version = Bump._bumpHotfix(version);
        break;
      default:
        throw new Error(`Unknown target ${options.target}`);
    }
    var bower = Bump.getBower();
    var packageFile = Bump.getPackage();
    manifest.version = version.manifest;
    //jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    manifest.version_name = `${version.manifest}-${versionName}`;
    //jscs:enable requireCamelCaseOrUpperCaseIdentifiers
    bower.version = version.package;
    packageFile.version = version.package;
    Bump.setPackage(packageFile);
    Bump.setBower(bower);
    Bump.setManifest(manifest);
    return manifest.version;
  },

  _bumpCanary: function(version) {
    version[3]++;
    return Bump._combineVersion(version);
  },

  _bumpDev: function(version) {
    version[2]++;
    return Bump._combineVersion(version);
  },
  _bumpBetaRelease: function(version) {
    version[0]++;
    version[1] = 0;
    return Bump._combineVersion(version);
  },
  _bumpBetaHotfix: function(version) {
    version[1]++;
    return Bump._combineVersion(version);
  },
  _bumpStable: function(version) {
    version[1] = 0;
    return Bump._combineVersion(version);
  },
  _bumpHotfix: function(version) {
    version[1]++;
    return Bump._combineVersion(version);
  },
  _combineVersion: function(version) {
    var result = {
      manifest: version.join('.')
    };
    version.pop();
    result.package = version.join('.');
    return result;
  }
};
module.exports = Bump;
