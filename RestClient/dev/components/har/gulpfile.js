'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var $ = require('gulp-load-plugins')();

// Lint JavaScript
gulp.task('lint', function() {
  return gulp.src([
      'lib/*.js',
      './gulpfile.js'
    ])
    .pipe($.jshint())
    .pipe($.jscs())
    .pipe($.jscsStylish.combineWithHintResults())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});
/**
 * Use Babel to parse the code and export it to the build directory.
 */
gulp.task('babel', function() {
  return gulp.src('lib/index.js', {read: false})
  .pipe(browserify({
    transform: ['babelify'],
  }))
  .pipe(rename('har.js'))
  .pipe(gulp.dest('./build/'));
});
/** 
 * Build the HAR library
 */
gulp.task('build', function(callback) {
  runSequence('lint', 'babel', function(error) {
    if (error) {
      gutil.log(error.message);
    } else {
      gutil.log('Build finished with success.');
    }
    callback(error);
  });
});
