'use strict';

const gulp = require('gulp');
const Bump = require('./bump-version.js');
const shell = require('shelljs');
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
const concat = require('concatenate-files');
const zipFolder = require('zip-folder');

var Builder = {
  commitMessage: '',
  workingBranch: 'develop',
  target: 'canary',
  version: '0.0.0.0',
  /**
   * Build a canary release.
   * 1. Bump version
   * 2. Push changes to git repository
   * 3. Build app (canary channel)
   * 4. Upload item to CSW (canary item)
   */
  buildCanary: (done) => {
    Builder.target = 'canary';
    var version = Bump.bump({
      target: 'canary'
    });
    Builder.version = version;
    var date = new Date().toGMTString();
    Builder.commitMessage = `Canary build at ${date} to version ${version}`;
    Builder.workingBranch = 'chrome-app';
    try {
      Builder._gitCommitAndPush();
    } catch (e) {
      console.error('Unable push changes to git repository. Task terminated.');
      done();
      return;
    }

    Builder._buildPackage()
    .then(() => {
      console.log(`Finished job.`);
      done();
    })
    .catch((e) => {
      console.error('Error Building canary', e);
      done();
    });
  },

  _gitAddAll: () => {
    return shell.exec('git add -A');
  },
  _gitCommit: () => {
    return shell.exec(`git commit -m "${Builder.commitMessage}"`);
  },
  _gitPush: () => {
    return shell.exec(`git push origin ${Builder.workingBranch}`);
  },

  _gitCommitAndPush: () => {
    if (Builder._gitAddAll().code !== 0) {
      throw new Error('Unable to add all files to commit');
    }
    if (Builder._gitCommit().code !== 0) {
      throw new Error('Unable to commit git repository');
    }
    if (Builder._gitPush().code !== 0) {
      throw new Error('Unable to push changes');
    }
  },

  _buildPackage: function() {
    return Builder._copyApp()
    .then(() => Builder._createPackage())
    .then(() => console.log('Package builded.'));
  },

  get buildTarget() {
    return path.join('build', Builder.target);
  },

  get distTarget() {
    return path.join('dist', Builder.target);
  },

  _copyApp: () => {
    return Builder._cleanTarget()
      .then(() => Builder._ensureBowerComponents())
      .then(() => Builder._ensureDirStructure())
      .then(() => Builder._copyFiles())
      .then(() => Builder._vulcanizeElements())
      .then(() => Builder._manifestDependecies())
      .then(() => {
        Builder._processIndexFile();
      })
      .then(() => {
        console.log('All files copied.');
      });
    // ML-PPSZT-OSX-EMEA:ChromeRestClient pawelpsztyc$ ln -s app/bower_components/ bower_components
    // ML-PPSZT-OSX-EMEA:ChromeRestClient pawelpsztyc$ vulcanize --inline-scripts --inline-css
    //--strip-comments app/elements/elements.html > dist/elements.html
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
   * Vulcanizer nned to have bower_components in root path.
   */
  _ensureBowerComponents: () => {
    return new Promise((resolve, reject) => {
      try {
        fs.lstat('./bower_components', (err, stats) => {
          if (err) {
            console.error('Ensure bower files symlink', err);
            reject(err);
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
      console.log('Creating dir', path);
      return new Promise((resolve, reject) => {
        console.log('Calling mkdir');
        fsensure.dir.exists(path, (err) => {
          console.log('Path exists', path);
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
      let source = path.join('app', 'elements', 'elements.html');
      let vulcan = new Vulcanize({
        inlineScripts: true,
        inlineCss: true,
        implicitStrip: true,
        stripComments: true
      });
      console.log('Processing elements.html');
      vulcan.process(source, function(err, inlinedHtml) {
        if (err) {
          return reject(err);
        }
        let jsFile = 'elements.js';
        var targetHtml = path.join(targetDir, 'elements', 'elements.html');
        var targetJs = path.join(targetDir, 'elements', jsFile);
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
    let targetDir = Builder.buildTarget;
    // var targetHtml = path.join(targetDir, 'index.html');
    return gulp.src('./app/index.html')
      .pipe(usemin({
        css: [],
        html: [],
        js: [],
        inlinejs: [],
        inlinecss: []
      }))
      .pipe(gulp.dest(targetDir));
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
  _manifestDependecies: () => {
    return new Promise((resolve, reject) => {
      let dest = Builder.buildTarget;
      let manifestFile = path.join(dest, 'manifest.json');
      fs.readFile(manifestFile, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        data = JSON.parse(data);
        var deps = data.app.background.scripts;
        var backgroundScript = 'scripts/background.js';
        deps = deps.filter((dep) => dep !== backgroundScript);
        deps = deps.map((dep) => './app/' + dep);
        let depsFilename = 'background-deps.js';
        let depsLocation = path.join(dest, depsFilename);
        concat(deps, depsLocation, {
          separator: '\n'
        }, (err) => {
          if (err) {
            console.error('Error building background page dependencies file.', err);
            reject(err);
            return;
          }
          //write new path to manifest
          data.app.background.scripts = [depsFilename, backgroundScript];
          data = JSON.stringify(data, null, 2);
          fs.writeFile(manifestFile, data, 'utf8', (err) => {
            if (err) {
              console.error('Error building background page dependencies file.', err);
              reject(err);
              return;
            }
            resolve();
          });
        });
      });
    });
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
      let fileName = `${Builder.target}-${Builder.version}-${date}.zip`;
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
            resolve();
          });
        }
      });
    });
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
  ]).pipe(gulp.dest(path.join(dest,'assets')));

  var scripts = gulp.src([
    'app/scripts/**',
    '!app/scripts/libs',
    '!app/scripts/libs/*',
    '!app/scripts/code-mirror',
    '!app/scripts/code-mirror/**'
  ]).pipe(gulp.dest(path.join(dest,'scripts')));

  var styles = gulp.src([
    'app/styles/*',
    '!app/styles/*.html'
  ]).pipe(gulp.dest(path.join(dest,'styles')));

  // Copy over only the bower_components we need
  // These are things which cannot be vulcanized
  var bower = gulp.src([
    'app/bower_components/{webcomponentsjs,font-roboto-local}/**/*'
  ]).pipe(gulp.dest(path.join(dest,'bower_components')));

  var codeMirror = gulp.src([
    'app/bower_components/codemirror/**/*'
  ]).pipe(gulp.dest(path.join(dest,'bower_components', 'codemirror')));

  // copy webworkers used in bower_components
  var webWorkers = gulp.src([
    'bower_components/socket-fetch/decompress-worker.js'
  ]).pipe(gulp.dest(path.join(dest, 'elements')));

  return merge(app, bower, webWorkers, assets, scripts, styles, codeMirror)
    .pipe($.size({
      title: 'copy'
    }));
});

module.exports = Builder;
