'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var crisper = require('gulp-crisper');
var minimist = require('minimist');
require('./tasks/dev-server.js');

var Cli = {
  getParams: (defaults) => {
    return minimist(process.argv.slice(2), defaults);
  },
  get buildOptions() {
    return {
      string: 'target',
      default: {
        target: process.env.NODE_ENV
      }
    };
  }
};
// Lint JavaScript files
gulp.task('lint', function() {
  return gulp.src([
      'app/scripts/**/*.js',
      'app/elements/**/*.js',
      'app/elements/**/*.html',
      '!app/scripts/workers/**/*.js',
      'gulpfile.js'
    ])
    // JSCS has not yet a extract option
    .pipe($.if('*.html', $.htmlExtract({
      strip: true
    })))
    .pipe($.jshint())
    .pipe($.jscs())
    .pipe($.jscsStylish.combineWithHintResults())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});
/**
 * Make all elements from ./app/elements/ CSP ready
 */
gulp.task('crisper-elements', function() {
  gulp.src('app/elements/**/*.html')
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
  gulp.src('app/bower_components/**/*.html')
    .pipe(crisper({
      scriptInHead: false,
      onlySplit: false,
      alwaysWriteScript: false
    }))
    .pipe(gulp.dest('app/bower_components/'));
});
// Load tasks for web-component-tester
// Adds tasks for `gulp test`
require('web-component-tester').gulp.init(gulp);
// Load custom tasks from the `tasks` directory
try {
  require('require-dir')('tasks');
} catch (err) {}

var build = (done) => {
  var Builder = require('./tasks/builder.js');
  var params = Cli.getParams(Cli.buildOptions);
  switch (params.target) {
    case 'canary':
      Builder.buildCanary(done);
      break;
    case 'dev':
      Builder.buildDev(done);
      break;
    case 'beta-hotfix':
      Builder.buildBeta(false, done);
      break;
    case 'beta-release':
      Builder.buildBeta(true, done);
      break;
    case 'stable':
      Builder.buildStable(false, done);
      break;
    case 'hotfix':
      Builder.buildStable(true, done);
      break;
    default:
      let msg = `Unknown target ${params.target}.

      Usage:
      gulp build --target <TARGET>

      Targets:
        canary          Build a canary (weekly) release
        dev             Build a dev release
        beta-release    Build a new beta release
        beta-hotfix     Hotfix existig beta release
        stable          Build a stable release
        hotfix          Hotfix stable release.

      Description:
        The build process is similar for all targets. However versionig system require different
        approach on each build type.
      `;
      console.log(msg);
  }
};

gulp.task('build', build);

gulp.task('test', function(done) {
  var Builder = require('./tasks/builder.js');
  Builder._vulcanizeElements().then(() => done());
});
