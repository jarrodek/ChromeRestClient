const path = require('path');
const fs = require('fs-extra');
const archiver = require('archiver');

let version = process.version;
if (version[0] === 'v') {
  version = version.substr(1);
}
const major = Number(version.split('.')[0]);
if (major < 10) {
  console.error('This script requires at least node version 10.');
  process.exit(-1);
}

class ArcBuilder {
  constructor(opts) {
    this.clientId = opts.clientId;
    if (!this.clientId) {
      throw new Error('Client ID is not set.');
    }
    if (!opts.channel) {
      throw new Error('channel is not set.');
    }
    this.base = path.join(__dirname, '..', '..');
    this.appDir = path.join(this.base, 'app');
    this.buildBase = path.join(this.base, 'build');
    this.distBase = path.join(this.base, 'dist');
    this.manifestFile = path.join(this.appDir, 'manifest.json');
    this.channel = opts.channel;
  }

  set channel(value) {
    this.__channel = value;
    this.versionSuffix = this.__channel;
    this.brandingPath = path.join(this.base, 'branding', value);
  }

  get channel() {
    return this.__channel;
  }

  set manifest(value) {
    this.__manifest = value;
    this.version = value.version;
    this.versionName = value.version + '-' + this.versionSuffix;
    this.bundleFile = 'arc-' + this.versionName + '.zip';
    this.bundlePath = path.join(this.distBase, this.bundleFile);
  }

  get manifest() {
    return this.__manifest;
  }

  build() {
    return this.ensureBranding()
    .then(() => this.ensureBuildDir())
    .then(() => this.ensureDistdDir())
    .then(() => this.setManifest())
    .then(() => this.copyApp())
    .then(() => this.applyBranding())
    .then(() => this.updateDistManifest())
    .then(() => this.zipApp())
    .then(() => {
      console.log('Build complete.');
      return this.bundlePath;
    })
    .catch((cause) => {
      console.error(cause);
    });
  }
  /**
   * Ensures branding exists for given channel.
   * @return {Promise}
   */
  ensureBranding() {
    return fs.pathExists(this.brandingPath)
    .then((exists) => {
      if (!exists) {
        throw new Error('Branding path does not exists: ' + this.brandingPath);
      }
    });
  }
  /**
   * Ensures build dir exists and is empty
   * @return {Promise}
   */
  ensureBuildDir() {
    return fs.emptydir(this.buildBase);
  }
  /**
   * Ensures dist dire exists.
   * @return {Promise}
   */
  ensureDistdDir() {
    return fs.ensureDir(this.distBase);
  }

  setManifest() {
    return fs.readJson(this.manifestFile)
    .then((data) => this.manifest = data);
  }

  copyApp() {
    console.log('Copying application files to build directory...');
    return fs.copy(this.appDir, this.buildBase, {
      filter: this._copyFilter.bind(this)
    });
  }

  _copyFilter(src) {
    if (src.indexOf('/bower_components/') !== -1) {
      if (src.indexOf('/test/') !== -1) {
        return false;
      }
      if (src.indexOf('/demo/') !== -1) {
        return false;
      }
      const files = [
        '/demo',
        '/test',
        '/tasks',
        'README.md',
        'index.html',
        '.bower.json',
        'bower.json',
        'analysis.json',
        'CHANGELOG.md',
        'CONTRIBUTING.md',
        'gen-tsd.json',
        'LICENSE.md',
        'package.json',
        'package-lock.json',
        'polymer.json',
        'wct.conf.json',
        '.travis.yml',
        '.gitignore',
        '.github',
        '.d.ts',
        'hero.svg',
        '/docs',
        '/bin',
        'Makefile',
        '/templates/publishing/manifest.json',
        '/templates/pesto/manifest.json',
        '/templates/shrine/manifest.json'
      ];
      for (let i = 0, len = files.length; i < len; i++) {
        if (src.indexOf(files[i]) !== -1) {
          return false;
        }
      }
    }

    const exclude = [
      'accessibility-developer-tools',
      'chai',
      'lodash',
      'mocha',
      'sinon-chai',
      'sinonjs',
      'stacky',
      'test-fixture',
      'web-component-tester',
      'index.old.html',
      '/test'
    ];
    for (let i = 0, len = exclude.length; i < len; i++) {
      if (src.indexOf(path.join('/' + exclude[i])) !== -1) {
        return false;
      }
    }
    return true;
  }

  applyBranding() {
    console.log('Applying branding...');
    return fs.copy(this.brandingPath, path.join(this.buildBase, 'assets'), {
      overwrite: true
    });
  }

  updateDistManifest() {
    console.log('Updating manifest file...');
    const data = this.manifest;
    delete data.key;
    data.oauth2.client_id = this.clientId;
    data.version_name = data.version + '-' + this.channel;
    const file = path.join(this.buildBase, 'manifest.json');
    return fs.outputJson(file, data);
  }

  zipApp() {
    console.log('Creating zip file...');
    return fs.remove(this.bundlePath)
    .then(() => fs.readdir(this.buildBase, {withFileTypes: true}))
    .then((files) => this._bundle(files));
  }

  _bundle(files) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(this.bundlePath);
      const archive = archiver('zip', {
        zlib: {level: 9}
      });
      archive.on('error', function(err) {
        console.error(err);
        reject(err);
      });
      output.on('close', function() {
        console.log('Package size: ' + archive.pointer() + ' bytes');
        resolve();
      });
      archive.on('warning', function(err) {
        console.warn(err);
      });
      archive.pipe(output);
      for (let i = 0, len = files.length; i < len; i++) {
        const file = files[i];
        const fileLocation = path.join(this.buildBase, file.name);
        if (file.isDirectory()) {
          archive.directory(fileLocation, file.name);
        } else {
          archive.file(fileLocation, {name: file.name});
        }
      }
      archive.finalize();
    });
  }
}
module.exports.ArcBuilder = ArcBuilder;
