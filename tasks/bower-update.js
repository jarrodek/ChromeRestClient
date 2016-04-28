'use strict';

const gulp = require('gulp');
const crisper = require('gulp-crisper');
const runSequence = require('run-sequence');
const fs = require('fs');

class BowerUpdate {

  postInstall() {
    return this.crisper()
    .then(() => this.fixPolymerImports())
    .then(() => this.fixSourceMaps());
  }

  // Crisper bower components so it can be used in the Chrome App.
  crisper() {
    return new Promise((resolve) => {
      runSequence(['crisper-bower'], () => {
        resolve();
      });
    });
  }
  // Fixes a roboto font issues and deprecated files errors
  fixPolymerImports() {
    console.log('Fixing polymer imports.');
    var files = [
      'app/bower_components/font-roboto/roboto.html',
      // 'app/bower_components/iron-flex-layout/classes/iron-flex-layout.html',
      'app/bower_components/iron-flex-layout/classes/iron-flex-layout.js',
      // 'app/bower_components/iron-flex-layout/classes/iron-shadow-flex-layout.html',
      'app/bower_components/iron-flex-layout/classes/iron-shadow-flex-layout.js',
    ];
    var promises = [];
    var fn = (file) => {
      return this.writeEmptyFile(file)
      /*.then(() => {
        console.log(`File ${file} has been overriten.`);
      })*/.catch((e) => {
        console.warn(`File ${file} can be processed to be overriten.`, e);
      });
    };
    files.forEach((file) => {
      try {
        let p = fn(file);
        promises.push(p);
      } catch(e) {
        console.log(e);
      }
    });
    return Promise.all(promises);
  }

  writeEmptyFile(file) {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, '', 'utf8', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  fixSourceMaps() {
    return new Promise((resolve, reject) => {
      let file = 'app/bower_components/zlib/bin/zlib_and_gzip.min.js';
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        data = data.replace('@ sourceMappingURL=zlib_and_gzip.min.js.map', '');
        fs.writeFile(file, data, 'utf8', (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  }
}

/**
 * Make all elements from ./app/elements/ CSP ready
 */
gulp.task('crisper-elements', function() {
  return gulp.src('app/elements/**/*.html')
  .pipe(crisper({
    scriptInHead: false,
    onlySplit: false,
    alwaysWriteScript: false
  }))
  .pipe(gulp.dest('app/elements/'));
});
/**
 * Make all bower_components CSP ready
 */
gulp.task('crisper-bower', function() {
  return gulp.src('app/bower_components/**/*.html')
    .pipe(crisper({
      scriptInHead: false,
      onlySplit: false,
      alwaysWriteScript: false
    }))
    .pipe(gulp.dest('app/bower_components/'));
});
module.exports = new BowerUpdate();
