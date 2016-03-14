'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var connect = require('gulp-connect');
var ensureFiles = require('./tasks/ensure-files.js');
var path = require('path');
var vulcanize = require('gulp-vulcanize');
var crisper = require('gulp-crisper');
var modRewrite = require('connect-modrewrite');
// var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var del = require('del');
var strip = require('gulp-strip-comments');

const Builder = require('./tasks/builder.js');
var minimist = require('minimist');
//var foreach = require('gulp-foreach');
//var gutil = require('gulp-util');

var Cli = {
  getParams: (defaults) => {
    return minimist(process.argv.slice(2), defaults);
  },
  get buildOptions() {
    return {
      string: 'build',
      default: {
        build: process.env.NODE_ENV || 'canary'
      }
    };
  }
};

var DIST = 'dist';
var dist = function(subpath) {
  return !subpath ? DIST : path.join(DIST, subpath);
};
// Clean output directory
gulp.task('clean', function() {
  return del(['.tmp', dist()]);
});
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

var optimizeHtmlTask = function(src, dest) {
  var assets = $.useref.assets({
    searchPath: ['.tmp', 'app']
  });
  return gulp.src(src)
    .pipe(assets)
    // Concatenate and minify JavaScript
    .pipe($.if('*.js', $.uglify({
      preserveComments: 'some'
    })))
    // Concatenate and minify styles
    // In case you are still using useref build blocks
    .pipe($.if('*.css', $.minifyCss()))
    .pipe(assets.restore())
    .pipe($.useref())
    // Minify any HTML
    .pipe($.if('*.html', $.minifyHtml({
      quotes: true,
      empty: true,
      spare: true
    })))
    // Output files
    .pipe(gulp.dest(dest))
    .pipe($.size({
      title: 'html'
    }));
};
// Scan your HTML for assets & optimize them
gulp.task('html', function() {
  return optimizeHtmlTask(
    ['app/**/*.html', '!app/{elements,test,bower_components}/**/*.html'],
    dist());
});
/**
 * Vulcanize all web-components into one file.
 */
gulp.task('vulcanize', function() {
  return gulp.src('app/elements/elements.html')
    .pipe(vulcanize({
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
    .pipe($.size({
      title: 'vulcanize'
    }));
});
gulp.task('minifyHtml', function() {
  return gulp.src('dist/elements/*.js')
  // .pipe(htmlmin({
    //removeComments: true,
    // removeCommentsFromCDATA: true,
    // removeCDATASectionsFromCDATA: true,
    // collapseWhitespace: true,
    // removeTagWhitespace: true,
    // keepClosingSlash: true,
    // minifyJS: true,
    // minifyCSS: true
  // }))
  .pipe(strip())
  .pipe($.uglify({
    preserveComments: 'some'
  }))

  .pipe(gulp.dest(dist()))
  .pipe($.size({
    title: 'Minify JS'
  }));
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
  gulp.src('app/bower_components/**/*.html')
    .pipe(crisper({
      scriptInHead: false,
      onlySplit: false,
      alwaysWriteScript: false
    }))
    .pipe(gulp.dest('app/bower_components/'));
});

gulp.task('connect', function() {
  connect.server({
    root: [__dirname + '/'],
    livereload: true,
    port: 8888,
    middleware: function() {
      return [
        modRewrite([
          //'^/app/bower_components/(.*)$ /bower_components/$1 [L]',
        ])
      ];
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

var build = (done) => {
  var params = Cli.getParams(Cli.buildOptions);
  switch (params.build) {
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
      let msg = `Unknown target ${params.build}.

      Usage:
      gulp build --build <TARGET>

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
