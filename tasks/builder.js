// var gulp = require('gulp');
// var git = require('gulp-git');
var Bump = require('./bump-version.js');
// var runSequence = require('run-sequence');
var shell = require('shelljs');

var Builder = {
  commitMessage: '',
  workingBranch: 'develop',
  /**
   * Build a canary release.
   * 1. Bump version
   * 2. Push changes to git repository
   * 3. Build app (canary channel)
   * 4. Upload item to CSW (canary item)
   */
  buildCanary: (done) => {
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
  }
};

module.exports = Builder;
