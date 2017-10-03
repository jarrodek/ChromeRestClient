'use strict';

const gulp = require('gulp');
const {ManifestProcessor} = require('./manifest-version.js');
const path = require('path');
const crisper = require('crisper');
const fs = require('fs');
const fsensure = require('fsensure');
const rimraf = require('rimraf');
const Vulcanize = require('vulcanize');
const usemin = require('gulp-usemin');
const $ = require('gulp-load-plugins')();
const runSequence = require('run-sequence');
const merge = require('merge-stream');
// const concat = require('concatenate-files');
const zipFolder = require('zip-folder');
// const uploader = require('./cws-uploader.js');

var Builder = {
  target: 'canary',
  targetDir: 'canary',
  version: '0.0.0.0',

  get bower() {
    return JSON.parse(fs.readFileSync('./bower.json', 'utf8'));
  },

  // get uploader() {
  //   if (!Builder._uploader) {
  //     Builder._uploader = require('./cws-uploader.js');
  //   }
  //   return Builder._uploader;
  // },
  /**
   * Build a canary release.
   * 1. Bump version
   * 2. Push changes to git repository
   * 3. Build app (canary channel)
   * 4. Upload item to CSW (canary item)
   */
  buildCanary: (opts, done) => {
    Builder.target = 'canary';
    Builder.targetDir = 'canary';
    if (!done) {
      return new Promise(resolve => {
        Builder._build(opts, resolve);
      });
    } else {
      Builder._build(opts, done);
    }
  },

  buildDev: (opts, done) => {
    Builder.target = 'dev';
    Builder.targetDir = 'dev';
    Builder._build(opts, done);
  },

  buildBeta: (opts, done) => {
    Builder.target = opts.isHotfix ? 'beta-hotfix' : 'beta-release';
    Builder.targetDir = 'beta';
    Builder._build(opts, done);
  },

  buildStable: (opts, done) => {
    Builder.target = opts.isHotfix ? 'stable-hotfix' : 'stable-release';
    Builder.targetDir = 'stable';
    Builder._build(opts, done);
  },

  _build: function(opts, done) {
    Builder.version = Builder.bower.version;
    var date = new Date().toGMTString();
    var buildName = Builder.target[0].toUpperCase() + Builder.target;
    Builder.commitMessage = `${buildName} build at ${date} to version ${Builder.version}`;

    return Builder._buildPackage()
    // .then(buildPath => {
      // if (opts.buildOnly) {
      //   return Promise.resolve();
      // }
      // return Builder._uploadPackage(buildPath);
    // })
    // .then(() => {
    //   if (opts.buildOnly || !opts.publish) {
    //     return Promise.resolve();
    //   }
    //   return Builder._publishPackage();
    // })
    .then(() => {
      console.log(`Finished job.`);
      done();
    })
    .catch((e) => {
      console.error('Error Building the app', e);
      done();
    });
  },

  // _gitCommitAndPush: () => {
  //   if (Builder._gitAddAll().code !== 0) {
  //     throw new Error('Unable to add all files to commit');
  //   }
  //   if (Builder._gitCommit().code !== 0) {
  //     throw new Error('Unable to commit git repository');
  //   }
  //   if (Builder._gitPush().code !== 0) {
  //     throw new Error('Unable to push changes');
  //   }
  // },

  _buildPackage: function() {
    return Builder._copyApp()
    .then(() => Builder._createPackage());
  },
  // /**
  //  * Upload the package to CWS.
  //  */
  // _uploadPackage: (buildPath) => {
  //   return Builder.uploader.auth()
  //   .then(() => Builder.uploader.uploadItem(buildPath, Builder.targetDir));
  // },
  // /**
  //  * Publish package after it has been uploaded.
  //  If it is done in the same run it does not require
  //  * another auth.
  //  */
  // _publishPackage: () => {
  //   return Builder.uploader.publishTarget(Builder.targetDir);
  // },

  get buildTarget() {
    return path.join('build', Builder.targetDir);
  },

  get distTarget() {
    return path.join('dist', Builder.targetDir);
  },

  _copyApp: () => {
    return Builder._cleanTarget()
      .then(() => Builder._ensureBowerComponents())
      .then(() => Builder._ensureDirStructure())
      .then(() => Builder._copyFiles())
      .then(() => Builder._vulcanizeElements())
      .then(() => Builder._processManifest())
      .then(() => Builder._processIndexFile())
      .then(() => Builder._applyBranding())
      .then(() => {
        console.log('All files copied.');
      });
  },
  /**
   * Removes target directory.
   */
  _cleanTarget: () => {
    return new Promise((resolve, reject) => {
      let targetDir = Builder.buildTarget;
      rimraf(targetDir, (err) => {
        if (err) {
          console.error('Can\'t remove path ', targetDir);
          reject(err);
          return;
        }
        console.log('Dir removed for target: ' + targetDir);
        resolve();
      });
    });
  },
  /**
   * Vulcanizer need to have bower_components in root path.
   */
  _ensureBowerComponents: () => {
    return new Promise((resolve) => {
      try {
        fs.lstat('./bower_components', (err, stats) => {
          if (err) {
            fs.symlink('./app/bower_components/', './bower_components', 'dir', () => {
              resolve();
            });
            return;
          }
          if (!stats.isSymbolicLink()) {
            fs.symlink('./app/bower_components/', './bower_components', 'dir', () => {
              resolve();
            });
            return;
          }
          console.log('Bower symlink exists');
          resolve();
        });
      } catch (e) {
        fs.symlink('./app/bower_components/', './bower_components', 'dir', () => {
          resolve();
        });
      }
    });
  },
  /**
   * Make sure we have all directories structure ready.
   */
  _ensureDirStructure: () => {
    console.log('Creating directory structure.');
    var structure = [
      'build/canary/elements',
      'build/dev/elements',
      'build/beta/elements',
      'build/stable/elements'
    ];
    var promises = [];
    var fn = (path) => {
      // console.log('Creating dir', path);
      return new Promise((resolve, reject) => {
        // console.log('Calling mkdir');
        fsensure.dir.exists(path, (err) => {
          // console.log('Path exists', path);
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    };
    structure.forEach((path) => promises.push(fn(path)));
    return Promise.all(promises)
    .then(() => {
      console.log('Directory structure OK');
    });
  },
  /**
   *
   */
  _vulcanizeElements: () => {
    console.log('Vulcanizing');
    return new Promise((resolve, reject) => {
      let targetDir = Builder.buildTarget;
      let source = path.join('app', 'index.html');
      let vulcan = new Vulcanize({
        inlineScripts: true,
        inlineCss: true,
        implicitStrip: true,
        stripComments: true,
        excludes: [
          // path.join('app', 'bower_components', 'font-roboto', 'roboto.html'),
          // path.join('bower_components', 'font-roboto', 'roboto.html')
        ]
      });
      console.log('Processing ', source, 'file');
      vulcan.process(source, function(err, inlinedHtml) {
        if (err) {
          return reject(err);
        }
        debugger;
        let jsFile = 'index.js';
        var targetHtml = path.join(targetDir, 'index.html');
        var targetJs = path.join(targetDir, jsFile);
        let output = crisper({
          source: inlinedHtml,
          jsFileName: jsFile,
          scriptInHead: false
        });
        fs.writeFileSync(targetHtml, output.html, 'utf-8');
        fs.writeFileSync(targetJs, output.js, 'utf-8');
        console.log('Saved in ', targetHtml, targetJs);
        resolve();
      });
    });
  },
  /**
   * Process the index.html file.
   */
  _processIndexFile: () => {
    return new Promise((resolve) => {
      runSequence(['processIndex'], () => {
        resolve();
      });
    });
  },
  /**
   * Copy files that are not copied by vulcanize process.
   */
  _copyFiles: () => {
    return new Promise((resolve) => {
      runSequence(['copy'], () => {
        resolve();
      });
    });
  },
  //combine all manifest dependecies into one file
  _processManifest: () => {
    var dest = Builder.buildTarget;
    var channel = Builder.targetDir;
    var processor = new ManifestProcessor(dest, channel);
    processor.updateManifest();
    return Promise.resolve();
  },
  /**
   * Create a package
   */
  _createPackage: () => {
    return new Promise((resolve, reject) => {
      let build = Builder.buildTarget;
      var options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      };
      var date = new Intl.DateTimeFormat(undefined, options).format(new Date());
      date = date.replace(/\//g, '-');
      let fileName = `${Builder.target}-${Builder.version}@${date}.zip`;
      let dist = path.join(Builder.distTarget, fileName);
      fsensure.dir.exists(Builder.distTarget, (err) => {
        if (err) {
          console.error('Creating package folders structure error', err);
          reject(err);
        } else {
          zipFolder(build, dist, (err) => {
            if (err) {
              console.error('Creating package file error', err);
              reject(err);
            }
            resolve(dist);
          });
        }
      });
    });
  },
  // Apply branding depending on the release.
  _applyBranding: () => {
    var srcIcons = [
      path.join('branding', Builder.targetDir, 'arc_icon_128.png'),
      path.join('branding', Builder.targetDir, 'arc_icon_48.png'),
      path.join('branding', Builder.targetDir, 'arc_icon_32.png'),
      path.join('branding', Builder.targetDir, 'arc_icon_16.png')
    ];
    var destIcons = [
      path.join(Builder.buildTarget, 'assets', 'arc_icon_128.png'),
      path.join(Builder.buildTarget, 'assets', 'arc_icon_48.png'),
      path.join(Builder.buildTarget, 'assets', 'arc_icon_32.png'),
      path.join(Builder.buildTarget, 'assets', 'arc_icon_16.png')
    ];
    var promises = [];
    var copy = (file, i) => {
      return new Promise((resolve, reject) => {
        try {
          let buffer = fs.readFileSync(file);
          fs.writeFileSync(destIcons[i], buffer);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    };
    srcIcons.forEach((file, i) => promises.push(copy(file, i)));
    return Promise.all(promises);
  }
};

// Copy all files at the root level (app)
gulp.task('copy', () => {
  var dest = Builder.buildTarget;
  var app = gulp.src([
    'app/*',
    '!app/index.html',
    '!app/test',
    '!app/elements',
    '!app/bower_components',
    '!**/.DS_Store'
  ], {
    dot: true
  }).pipe(gulp.dest(dest));

  var assets = gulp.src([
    'app/assets/*',
  ]).pipe(gulp.dest(path.join(dest, 'assets')));

  var scripts = gulp.src([
    'app/scripts/**',
    // '!app/scripts/libs',
    // '!app/scripts/libs/*'
  ]).pipe(gulp.dest(path.join(dest, 'scripts')));

  var styles = gulp.src([
    'app/styles/*',
    '!app/styles/*.html'
  ]).pipe(gulp.dest(path.join(dest, 'styles')));

  // Copy over only the bower_components we need
  // These are things which cannot be vulcanized
  var bower = gulp.src([
    'app/bower_components/{webcomponentsjs,font-roboto-local,codemirror,prism/components,cookie-parser}/**/*',
    '!app/bower_components/codemirror/lib/**',
    '!app/bower_components/codemirror/theme/**',
    '!app/bower_components/codemirror/keymap/**',
    '!app/bower_components/codemirror/*',
    '!app/bower_components/font-roboto-local/fonts/robotomono/**'
  ]).pipe(gulp.dest(path.join(dest, 'bower_components')));

  // copy webworkers used in bower_components
  var webWorkers = gulp.src([
    'app/bower_components/socket-fetch/decompress-worker.js'
  ]).pipe(gulp.dest(path.join(dest, 'bower_components', 'socket-fetch')));

  // zlib library need to placed folder up relativelly to decompress-worker
  var zlibLibrary = gulp.src([
    'app/bower_components/zlib/bin/zlib_and_gzip.min.js'
  ]).pipe(gulp.dest(path.join(dest, 'bower_components', 'zlib', 'bin')));

  var bowerDeps = [
    // 'chrome-platform-analytics/google-analytics-bundle.js',
    // 'dexie-js/dist/dexie.min.js',
    // 'har/build/har.js',
    // 'lodash/lodash.js',
    // 'uri.js/src/URI.js',
    'prism/prism.js',
    'prism/plugins/autolinker/prism-autolinker.min.js'
  ];
  var dependencies = gulp.src([
    `app/bower_components/{${bowerDeps.join(',')}}`,
  ]).pipe(gulp.dest(path.join(dest, 'bower_components')));

  return merge(
      app, bower, webWorkers, assets, scripts, styles,
      /*, codeMirror*/
      zlibLibrary, dependencies
    )
    .pipe($.size({
      title: 'copy'
    }));
});

gulp.task('processIndex', () => {
  let targetDir = Builder.buildTarget;
  var targetHtml = path.join(targetDir, 'index.html');
  return gulp.src(targetHtml)
    .pipe(usemin({
      css: [],
      html: [],
      js: [],
      inlinejs: [],
      inlinecss: []
    }))
    .pipe(gulp.dest(targetDir));
});

module.exports = Builder;
