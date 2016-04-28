'use strict';

var gulp = require('gulp');
var minimist = require('minimist');
require('./tasks/dev-server.js');

var Cli = {
  getParams: (defaults) => {
    return minimist(process.argv.slice(2), defaults);
  },
  get buildOptions() {
    return {
      string: 'target',
      default: {
        target: process.env.NODE_ENV
      }
    };
  },
  get publishTarget() {
    return {
      string: 'target',
      default: {
        target: process.env.NODE_ENV
      }
    };
  },
  get publishAudience() {
    return {
      string: 'audience',
      default: {
        target: process.env.NODE_ENV
      }
    };
  }
};
// Lint JavaScript files
gulp.task('lint', function() {
  var lint = require('./tasks/lint.js');
  return lint();
});
// tasks to be prformed when bower is updated.
gulp.task('bower-update', (done) => {
  var bu = require('./tasks/bower-update.js');
  bu.postInstall()
  .then(() => {
    console.log('Project builded after bower update.');
    done();
  })
  .catch((e) => {
    console.log('unable to build project after bower update.');
    done(e);
  });
});
// Load tasks for web-component-tester
// Adds tasks for `gulp test`
require('web-component-tester').gulp.init(gulp);
// Load custom tasks from the `tasks` directory
try {
  require('require-dir')('tasks');
} catch (err) {}

var buildHelpMessage = `Usage:
gulp build --target <TARGET> [--hotfix] [--build-only] [--publish]

Targets:
  canary          Build a canary (daily) release
  dev             Build a dev (feature) release
  beta            Build a beta (RC) release
  stable          Build a stable release

Options:
  --hotfix        Treat the release as a hotfix release. It matters only for versioning
                  system (during version bump) See tasks/bump-version.js for more info.
                  Bu default it's full release.

  --build-only    Don't push changes to git and don't publish the app in the store. It
                  overrides --publish and prevent script from publishing the app.

  --publish       If set the script will publish the app. You'll be asked to log in to your
                  Google account during the process. By detault the app is not published.
                  Note that the app will be uploaded to the store but not published even if
                  --publish is not set.

Description:
  Build the app, update git repository and publish the app in the store.

Examples:
  gulp build --target canary --publish
  This will build canary release, push changes to the git repository and publish the app.

  gulp build --target beta --hotfix --build-only
  This will only build beta release as a hotfix (only minor number will increase).
`;

var build = (done) => {
  var params = Cli.getParams(Cli.buildOptions);
  if (params.help) {
    console.log(buildHelpMessage);
    done();
    return;
  }
  var Builder = require('./tasks/builder.js');
  var options = {
    isHotfix: params.hotfix || false,
    buildOnly: params['build-only'] || false,
    publish: params.publish || false
  };
  if (options.buildOnly && options.publish) {
    options.publish = false;
  }

  switch (params.target) {
    case 'canary':
      Builder.buildCanary(options, done);
      break;
    case 'dev':
      Builder.buildDev(options, done);
      break;
    case 'beta':
      if (!options.isHotfix) {
        let confirm = require('confirm-simple');
        confirm('Upgrade the version major version?', ['ok', 'cancel'] , (ok) => {
          if (!ok) {
            done();
          } else {
            Builder.buildBeta(options, done);
          }
        });
      } else {
        Builder.buildBeta(options, done);
      }
      break;
    case 'stable':
      Builder.buildStable(options, done);
      break;
    default:
      let msg = `Unknown target ${params.target}.

      ${buildHelpMessage}
      `;
      console.log(msg);
      done();
  }
};

var publish = (done) => {
  var params = Cli.getParams(Cli.publishTarget);
  switch (params.target) {
    case 'canary':
    case 'dev':
    case 'beta':
    case 'stable':
      let Publisher = require('./tasks/cws-uploader.js');
      Publisher.publishTarget(params.target, params.audience)
        .then(() => {
          console.log('The item has been published.');
          done();
        })
        .catch((err) => {
          done(err);
        });
      break;
    default:
      let msg = `Unknown target ${params.target}.

      Usage:
      gulp publish --target <TARGET> [--audience <AUDIENCE>]

      Targets:
        canary          Publish a canary channel app in the store.
        dev             Publish a dev channel app in the store.
        beta            Publish a beta channel app in the store.
        stable          Publish the app in the store.

      Audience:
        all             The app will be publicly available
        testers         The app will be published for testers.

      Description:
        The command will publish the app for given channel. If --audience parameter is not present
        the one from cws-config.json file will be used.
        The app must have testers group assigned in order to publish to testers.
      `;
      console.log(msg);
      done();
  }
};

gulp.task('build', build);
gulp.task('publish', publish);

var testServer = () => {
  let srv = require('./tasks/ssl.js');
  srv.create();
};
gulp.task('test-server', testServer);
gulp.task('srv', testServer);

gulp.task('test', function(done) {
  var analyzer = require('./tasks/tree-analyzer.js');
  analyzer.analyseDependencies().then(() => done()).catch((e) => {
    console.error('An error occured', Object.getOwnPropertyNames(e));
    console.error(e.message);
    console.error(e.stack);
    done();
  });
});
