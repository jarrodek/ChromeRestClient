/**
 * Gulp file.
 */
var fs = require("fs"),
  gulp = require("gulp"),
  jshint = require("gulp-jshint"),
  mocha = require("gulp-mocha");

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
// Strip comments from JsHint JSON files (naive).
var _jshintCfg = function (name) {
  var raw = fs.readFileSync(name).toString();
  return JSON.parse(raw.replace(/\/\/.*\n/g, ""));
};

// ----------------------------------------------------------------------------
// JsHint
// ----------------------------------------------------------------------------
gulp.task("jshint", function () {
  gulp
    .src([
      "test/**/*.js",
      "*.js"
    ])
    .pipe(jshint(_jshintCfg(".jshintrc.json")))
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

// ----------------------------------------------------------------------------
// Mocha
// ----------------------------------------------------------------------------
gulp.task("test", function () {
  gulp
    .src([
      "test/**/*.spec.js"
    ])
    .pipe(mocha({
      reporter: "spec"
    }));
});

// ----------------------------------------------------------------------------
// Aggregated Tasks
// ----------------------------------------------------------------------------
gulp.task("check",      ["jshint", "test"]);
gulp.task("default",    ["check"]);
