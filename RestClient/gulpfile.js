'use strict';

var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var crisper = require('gulp-crisper');
var preprocess = require('gulp-preprocess');
var merge = require('merge-stream');
var $ = require('gulp-load-plugins')();
var ensureFiles = require('./tasks/ensure-files.js');
var path = require('path');
var gutil = require('gulp-util');
var vinylPaths = require('vinyl-paths');
var del = require('del');
var runSequence = require('run-sequence');
var bump = require('gulp-bump');
var zip = require('gulp-zip');

/**
 * Tasks that build different version should use this switched to 
 * switch between `dev`, `beta`, and `stable` versions.
 */
var mode = 'dev';

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

/**
 * Copy images from the dev/components to it's corresponding folders in war/
 */
gulp.task('copy:images', function() {
  return gulp.src('dev/**/*.png', {base: 'dev'})
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('war/'))
    .pipe($.size({title: 'images'}));
});
// Copy all files at the root level (war)
gulp.task('copy:devsources', ['copy:images'], function() {
  return gulp.src([
    'dev/*',
    'dev/**/*',
    '!dev/dirinfo.md',
    '!**/.DS_Store',
    '!**/*.png'
  ], {
    base: 'dev', 
    dot: true
  })
  .pipe(preprocess({
    context: {
      NODE_ENV: mode
    }
  }))
  .pipe(gulp.dest('war/'))
  .pipe($.size({
    title: 'copy'
  }));
});
//copy sources to the `dist` folder
gulp.task('copy:dist', function() {
  var root = gulp.src([
    'war/*',
    '!war/**/*.jsp',
    '!war/components',
    '!war/static',
    '!war/WEB-INF',
    '!war/cs.js',
    '!war/dev.js',
    '!war/GDrive.html',
    '!war/host.all.js',
    '!war/oauth2callback.html',
    '!war/Starter.css',
    '!war/starter.js',
    '!war/ext/*_uncompressed.js',
    '!**/.DS_Store'
  ], { 
    dot: true
  })
  .pipe(gulp.dest('dist/sources/'));
  var components = gulp.src([
    'war/components/vulcanized/*'
  ], { 
    dot: true
  })
  .pipe(gulp.dest('dist/sources/components/'));
  var manifest = gulp.src([
    'manifest.json'
  ], { 
    dot: true
  })
  .pipe(gulp.dest('dist/sources/'));
  return merge(root, components, manifest)
  .pipe($.size({
    title: 'copy'
  }));
});

gulp.task('zip', function() {
  return gulp.src('dist/sources/*').pipe(zip('extension.zip')).pipe(gulp.dest('dist'));
});
/**
 * Copy development files on change.
 */
var copySourceFile = function(obj) {
  //gutil.log('copyDev called');
  return gulp.src(obj.path, {base: 'dev', dot: true})
  .pipe($.if('!*.png', preprocess({
    context: {
      NODE_ENV: mode
    }
  })))
  .pipe(gulp.dest('war/'))
  .pipe($.size({
    title: 'copy '+mode+' file '
  }));
};

/**
 * Prepare development environment.
 * It will include separate js libraries into the index page and put it in the extension 
 * environment.
 */
gulp.task('dev', ['mode:dev', 'lint', 'copy:devsources'], function() {
  gulp.watch('dev/**/*.html', copySourceFile);
  gulp.watch('dev/**/*.js', copySourceFile);
  gulp.watch('dev/**/*.jsp', copySourceFile);
  gulp.watch('dev/**/*.css', copySourceFile);
});


gulp.task('clean:dist', function () {
  return gulp.src('dist/*')
    .pipe(vinylPaths(del));
});

gulp.task('mode:dev', function() {
  mode = 'dev';
});

gulp.task('bump-dev-build', function() {
  return gulp.src('./manifest.json')
  .pipe(bump({type: 'patch'}))
  .pipe(bump({key: 'version_name', type: 'prerelease', 'preid':'dev'}))
  .pipe(gulp.dest('./'));
});
gulp.task('build:dev', function(callback) {
  runSequence(
    'mode:dev',
    'clean:dist',
    'copy:devsources', 
    'vulcanize',
    'bump-dev-build',
    'copy:dist',
    'zip',
    function (error) {
      if (error) {
        gutil.log(error.message);
      } else {
        gutil.log('RELEASE FINISHED SUCCESSFULLY');
      }
      callback(error);
    }
  );
});
/*


*/
