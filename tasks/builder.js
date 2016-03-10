'use strict';

const gulp = require('gulp');
const Bump = require('./bump-version.js');
const shell = require('shelljs');
const path = require('path');
const crisper = require('crisper');
const fs = require('fs');
const Vulcanize = require('vulcanize');
const hydrolysis = require('hydrolysis');
const usemin = require('gulp-usemin');
const uglify = require('gulp-uglify');

var Builder = {
  commitMessage: '',
  workingBranch: 'develop',
  target: 'canary',
  /**
   * Build a canary release.
   * 1. Bump version
   * 2. Push changes to git repository
   * 3. Build app (canary channel)
   * 4. Upload item to CSW (canary item)
   */
  buildCanary: (done) => {
    Builder._copyApp()
    .then(() => done());
    return;
    Builder.target = 'canary';
    var version = Bump.bump({
      target: 'canary'
    });
    var date = new Date().toGMTString();
    Builder.commitMessage = `Canary build at ${date} to version ${version.manifest}`;
    Builder.workingBranch = 'chrome-app';
    if (Builder._gitAddAll().code !== 0) {
      done(new Error('Unable to add all files to commit'));
      return;
    }
    if (Builder._gitCommit().code !== 0) {
      done(new Error('Unable to commit git repository'));
      return;
    }
    if (Builder._gitPush().code !== 0) {
      done(new Error('Unable to push changes'));
      return;
    }
    done();
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

  get buildTarget() {
    return path.join('build', Builder.target);
  },

  _copyApp: () => {
    //Builder._ensureBowerComponents();
    Builder._ensureDirStructure();
    return Builder._vulcanizeElements()
    .then(() => {
      Builder._processIndex();
    })
    .catch((e)=> console.error('eeeeeee', e));
    // ML-PPSZT-OSX-EMEA:ChromeRestClient pawelpsztyc$ ln -s app/bower_components/ bower_components
    // ML-PPSZT-OSX-EMEA:ChromeRestClient pawelpsztyc$ vulcanize --inline-scripts --inline-css
    //--strip-comments app/elements/elements.html > dist/elements.html
  },

  /**
   * Vulcanizer has to have bower_components in root path.
   */
  _ensureBowerComponents: () => {
    try {
      return shell.exec(`ln -s app/bower_components/ ./bower_components`);
    } catch (e) { }
  },
  _ensureDirStructure: () => {
    var structure = [
      'build/canary/elements'
    ];
    structure.forEach((path) => {
      if (shell.exec(`mkdir -p ${path}`).code !== 0) {
        throw new Error('Path "' + path + '" can\'t be created');
      }
    });
  },
  /**
   *
   */
  _vulcanizeElements: () => {
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

  _processIndex: () => {
    let targetDir = Builder.buildTarget;
    var targetHtml = path.join(targetDir, 'index.html');
    return gulp.src('./app/index.html')
    .pipe(usemin({
      css: [],
      html: [],
      js: [],
      inlinejs: [],
      inlinecss: [],
      jsAttributes: {
        async: true
      }
    }))
    .pipe(gulp.dest(targetDir));
  }
};

module.exports = Builder;
