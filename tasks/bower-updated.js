const gulp = require('gulp');
const crisper = require('@advanced-rest-client/gulp-crisper');
const fs = require('fs-extra');

class BowerUpdated {
  run() {
    return this.crisper()
    .then(() => this.fixPolymerImports())
    .catch((cause) => {
      console.error(cause);
      process.exit(1);
    });
  }

  waitFor(stream) {
    return new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });
  }

  crisper() {
    console.log('Crisper');
    const stream = gulp.src('app/bower_components/**/*.html')
    .pipe(crisper({
      scriptInHead: false,
      onlySplit: false,
      alwaysWriteScript: false
    }))
    .pipe(gulp.dest('app/bower_components/'));
    return this.waitFor(stream);
  }

  fixPolymerImports() {
    console.log('Fixing polymer imports.');
    const files = [
      'app/bower_components/font-roboto/roboto.html'
    ];
    const promises = [];
    files.forEach((file) => {
      try {
        const p = fs.writeFile(file, '', 'utf8');
        promises.push(p);
      } catch (e) {
        console.log(e);
      }
    });
    return Promise.all(promises);
  }
}

new BowerUpdated().run();
