var fs = require("fs"),
  path = require("path"),

  chai = require("chai"),
  expect = chai.expect,

  gutil = require("gulp-util"),
  extract = require("../html-extract"),
  html = fs.readFileSync(path.join(__dirname, "test.html"), "utf8"),

  file,
  count,
  err;

// Helpers
var expectEmpty = function (file, done) {
  extract()
    .on("data", function () {
      count++;
    })
    .on("error", function (err) {
      err = err;
    })
    .on("end", function () {
      expect(err).to.not.be.ok;
      expect(count).to.equal(0);
      done(err);
    })
    .end(file);
};

describe("html-extract", function () {

  beforeEach(function () {
    // Fake file.
    file = new gutil.File({
      path: "test/test.html",
      contents: new Buffer(html)
    });

    count = 0;
    err = null;
  });

  it("handles an empty string", function (done) {
    file = new gutil.File({
      path: "test/test.html",
      contents: new Buffer("")
    });

    expectEmpty(file, done);
  });


  it("handles bad HTML", function (done) {
    file = new gutil.File({
      path: "test/test.html",
      contents: new Buffer("<html_OMG_THIS_ISBAD</BAD>")
    });

    expectEmpty(file, done);
  });

  it("handles no body", function (done) {
    file = new gutil.File({
      path: "test/test.html",
      contents: new Buffer("<html></html>")
    });

    expectEmpty(file, done);
  });

  it("handles no matches with custom selectors", function (done) {
    extract({ sel: ".NO_MATCH" })
      .on("data", function () {
        count++;
      })
      .on("error", function (err) {
        err = err;
      })
      .on("end", function () {
        expect(err).to.not.be.ok;
        expect(count).to.equal(0);
        done(err);
      })
      .end(file);
  });

  it("extracts scripts by default", function (done) {
    extract()
      .on("data", function (file) {
        count++;
        expect(file.path).to.contain("-script");
        expect(file.contents.toString()).to.contain("var ");
      })
      .on("error", function (err) {
        err = err;
      })
      .on("end", function () {
        expect(err).to.not.be.ok;
        expect(count).to.equal(3);
        done(err);
      })
      .end(file);
  });

  it("extracts custom selectors", function (done) {
    extract({ sel: "textarea" })
      .on("data", function (file) {
        count++;
        expect(file.path).to.contain("-textarea");
        expect(file.contents.toString()).to.contain("_TEXT");
      })
      .on("error", function (err) {
        err = err;
      })
      .on("end", function () {
        expect(err).to.not.be.ok;
        expect(count).to.equal(2);
        done(err);
      })
      .end(file);
  });

  it("matches id", function (done) {
    extract({ sel: "#first-textarea" })
      .on("data", function (file) {
        var text = file.contents.toString().replace(/^\s*|\s*$/g, "");

        count++;
        expect(file.path).to.contain("first-textarea");
        expect(text).to.equal("FIRST_TEXT");
      })
      .on("error", function (err) {
        err = err;
      })
      .on("end", function () {
        expect(err).to.not.be.ok;
        expect(count).to.equal(1);
        done(err);
      })
      .end(file);
  });
});
