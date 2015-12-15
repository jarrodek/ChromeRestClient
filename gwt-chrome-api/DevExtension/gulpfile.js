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
var $ = require('gulp-load-plugins')();

// Lint JavaScript
gulp.task('lint', function() {
  return gulp.src([
      'background.js',
      'cs.js',
      'host.js',
      'gulpfile.js',
      'apis/**.js'
    ])
  // JSCS has not yet a extract option
  .pipe($.jshint())
  .pipe($.jscs())
  .pipe($.jscsStylish.combineWithHintResults())
  .pipe($.jshint.reporter('jshint-stylish'))
  .pipe($.jshint.reporter('fail'));
});

gulp.task('compress', function() {
  return gulp.src(['./host.js','./apis/*.js'])
    .pipe(concat('host.all.js'))
    .pipe(gulp.dest('../../RestClient/war'));
});

// Load custom tasks from the `tasks` directory
try {
  require('require-dir')('tasks');
} catch (err) {}
