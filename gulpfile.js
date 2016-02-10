'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var connect = require('gulp-connect');
var ensureFiles = require('./tasks/ensure-files.js');
var path = require('path');
var vulcanize = require('gulp-vulcanize');
var crisper = require('gulp-crisper');
var modRewrite = require('connect-modrewrite');
//var foreach = require('gulp-foreach');
//var gutil = require('gulp-util');

var DIST = 'dist';
var dist = function(subpath) {
  return !subpath ? DIST : path.join(DIST, subpath);
};
// Ensure that we are not missing required files for the project
// "dot" files are specifically tricky due to them being hidden on
// some systems.
gulp.task('ensureFiles', function(cb) {
  var requiredFiles = ['.jscsrc', '.jshintrc', '.bowerrc'];
  ensureFiles(requiredFiles.map(function(p) {
    return path.join(__dirname, p);
  }), cb);
});
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
 * Vulcanize all web-components into one file.
 * TODO: do I really need it? There's no long running HTTP request to download this files.
 * Since they are stored locally is probably dont matter. But to be sure it need to pass
 * performance test.
 */
gulp.task('vulcanize', function() {
  return gulp.src('app/elements/elements.html')
    .pipe(vulcanize({
      abspath: '',
      excludes: [],
      stripExcludes: false,
      inlineScripts: true,
      inlineCss: true,
      stripComments: true
    }))
    .pipe(crisper({
      scriptInHead: false,
      onlySplit: false
    }))
    .pipe(gulp.dest(dist('elements')))
    .pipe(gulp.dest('war/components/vulcanized'));
});
/**
 * Make all elements CSP ready
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
  gulp.src('bower_components/**/*.html')
    .pipe(crisper({
      scriptInHead: false,
      onlySplit: false,
      alwaysWriteScript: false
    }))
    .pipe(gulp.dest('bower_components/'));
});

gulp.task('connect', function() {
  connect.server({
      root: [__dirname + '/'],
      livereload: true,
      port: 8888,
      middleware: function() {
        return [
          modRewrite([
            '^/app/bower_components/(.*)$ /bower_components/$1 [L]',
          ])
        ]
      }
  });
});

gulp.task('html', function() {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});
gulp.task('watch', function() {
  gulp.watch(['./app/*.html'], ['html']);
});
gulp.task('elements-webserver', ['connect', 'watch']);
// Load tasks for web-component-tester
// Adds tasks for `gulp test`
require('web-component-tester').gulp.init(gulp);
// Load custom tasks from the `tasks` directory
try {
  require('require-dir')('tasks');
} catch (err) {}
