'use strict';

var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var crisper = require('gulp-crisper');
var preprocess = require('gulp-preprocess');
var merge = require('merge-stream');
var $ = require('gulp-load-plugins')();
var ensureFiles = require('./tasks/ensure-files.js');
var path = require('path');

// Ensure that we are not missing required files for the project
// "dot" files are specifically tricky due to them being hidden on
// some systems.
gulp.task('ensureFiles', function(cb) {
  var requiredFiles = ['.jscsrc', '.jshintrc', '.bowerrc'];

  ensureFiles(requiredFiles.map(function(p) {
    return path.join(__dirname, p);
  }), cb);
});
// Lint JavaScript
gulp.task('lint', function() {
  return gulp.src([
      'dev/libs/*.js',
      'dev/*.js',
      'dev/components/app-*.html',
      'dev/components/app-*.js',
      'dev/components/file-drop/*.html',
      'dev/components/file-drop/*.js',
      'dev/components/server-import-data-table/*.html',
      'dev/components/server-import-data-table/*.js',
      'gulpfile.js',
      '!dev/host.all.js',
      '!dev/background.js',
      '!dev/google-analytics-bundle.js'
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

gulp.task('vulcanize', function() {
  return gulp.src('war/components/elements.html')
    .pipe(vulcanize({
      abspath: '',
      excludes: [],
      stripExcludes: false,
      inlineScripts: true,
      inlineCss: true,
      stripComments: true
    }))
    //.pipe($.rename('elements.vulcanized.html'))
    .pipe(crisper({
      scriptInHead: false, // true is default 
      onlySplit: false
    }))
    .pipe(gulp.dest('war/components/vulcanized'));
});

gulp.task('serve', function() {
  // java -cp D:\SDK\gwt\gwt-2.7.0\gwt-dev.jar com.google.gwt.dev.DevMode 
  //-startupUrl RestClient.html -logLevel INFO -war F:\workspace\ChromeRestClient\RestClient\war 
  //-server com.google.appengine.tools.development.gwt.AppEngineLauncher -superDevMode 
  //-codeServerPort 9997 -port 8888 org.rest.RestClient -remoteUI 
  //"${gwt_remote_ui_server_port}:${unique_id}"
});
// Copy all files at the root level (war)
gulp.task('copy', function() {
  var app = gulp.src([
    'dev/*',
    'dev/**/*',
    '!dev/dirinfo.md',
    '!**/.DS_Store'
  ], {
    dot: true
  }).pipe(gulp.dest('war/'));

  return merge(app)
    .pipe($.size({
      title: 'copy'
    }));
});
/**
 * Copy development files on change.
 */
var copyDev = function(obj) {
  gulp.src(obj.path)
    .pipe(preprocess({
      context: {
        NODE_ENV: 'dev'
      }
    }))
    .pipe(gulp.dest('./war/'));
};

/**
 * Prepare development environment.
 * It will include separate js libraries into the index page and put it in the extension 
 * environment.
 */
gulp.task('dev', ['lint', 'copy'], function() {
  gulp.watch('dev/**/*.html', copyDev);
  gulp.watch('dev/**/*.js', copyDev);
  gulp.watch('dev/**/*.jsp', copyDev);
  gulp.watch('dev/**/*.css', copyDev);
});
