/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

'use strict';

// Include Gulp & tools we'll use
var gulp = require('gulp');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var $ = require('gulp-load-plugins')();

// Lint JavaScript
gulp.task('lint', function() {
  return gulp.src([
      'DevExtension/background.js',
      'DevExtension/cs.js',
      'DevExtension/host.js',
      'DevExtension/gulpfile.js',
      'DevExtension/apis/**.js'
    ])
  // JSCS has not yet a extract option
  .pipe($.jshint())
  .pipe($.jscs())
  .pipe($.jscsStylish.combineWithHintResults())
  .pipe($.jshint.reporter('jshint-stylish'))
  .pipe($.jshint.reporter('fail'));
});

gulp.task('compress', function() {
  return gulp.src(['./DevExtension/host.js','./DevExtension/apis/*.js'])
    .pipe(concat('host.all.js'))
    .pipe(gulp.dest('./DevExtension'));
});
/**
 * Copy to ARC war directory
 */
gulp.task('copy', function() {
  return gulp.src('./DevExtension/host.all.js')
    .pipe(gulp.dest('../RestClient/war/'))
    .pipe($.size({
      title: 'copy'
    }));
});

// Build production files, the default task
gulp.task('default', function(cb) {
  runSequence(
    'lint',
    'compress',
    'copy',
    cb);
});

// Load custom tasks from the `tasks` directory
try {
  require('require-dir')('tasks');
} catch (err) {}
