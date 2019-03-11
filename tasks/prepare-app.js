const path = require('path');
const fs = require('fs-extra');
const browserify = require('browserify');
const UglifyJS = require('uglify-js');
const babel = require('@babel/core');
// var decompress = require('brotli/decompress');

/**
 * A class that is executed when node dependencies are installed.
 * Performs tasks required to run the app including node modeles.
 */
class ArcChromePrepare {
  run() {
    return this.copyZlib()
    .then(() => this.copyBrotli())
    .then(() => this.copyJexl())
    .then(() => this.copyHotkeys());
  }
  /**
   * Coppies z-lib library to the application folder.
   * @return {Promise}
   */
  copyZlib() {
    const dir = path.join('app', 'scripts', 'libs', 'zlib');
    return fs.emptyDir(dir)
    .then(() => {
      // node_modules/zlibjs/bin/zlib_and_gzip.min.js
      const src = path.join('node_modules', 'zlibjs', 'bin', 'zlib_and_gzip.min.js');
      const dest = path.join(dir, 'zlib_and_gzip.min.js');
      return fs.copy(src, dest);
    });
  }

  copyBrotli() {
    const file = path.join('tasks', 'brotli-import.js');
    return this.nodeToBrowser(file)
    .then((code) => this.babelify(code))
    .then((content) => this.uglyContent(content))
    .then((content) => {
      const dir = path.join('app', 'scripts', 'libs', 'zlib');
      const dest = path.join(dir, 'brotli.min.js');
      return fs.writeFile(dest, content, 'utf8');
    });
  }

  nodeToBrowser(file) {
    return new Promise((resolve) => {
      const b = browserify();
      b.add(file);
      b.bundle((err, buf) => {
        if (err) {
          console.log(err);
        }
        resolve(buf.toString());
      });
    });
  }

  uglyContent(content) {
    const result = UglifyJS.minify(content, {
      compress: true
    });
    if (result.error) {
      throw result.error;
    }
    return result.code;
  }

  babelify(code) {
    return new Promise((resolve, reject) => {
      const cnf = {
        'presets': [[
          '@babel/preset-env'
        ]],
        'plugins': ['minify-mangle-names']
      };
      babel.transform(code, cnf, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result.code);
        }
      });
    });
  }

  waitFor(stream) {
    return new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });
  }

  copyJexl() {
    const file = path.join('tasks', 'jexl-import.js');
    const dir = path.join('app', 'scripts', 'libs', 'jexl');
    return fs.emptyDir(dir)
    .then(() => this.nodeToBrowser(file))
    .then((code) => this.babelify(code))
    .then((content) => this.uglyContent(content))
    .then((content) => {
      const dest = path.join(dir, 'jexl.min.js');
      return fs.writeFile(dest, content, 'utf8');
    });
  }

  copyHotkeys() {
    const src = path.join('node_modules', 'hotkeys-js', 'dist', 'hotkeys.esm.js');
    const dest = path.join('app', 'scripts', 'libs', 'hotkeys.esm.js');
    return fs.copy(src, dest);
  }
}

new ArcChromePrepare().run();
