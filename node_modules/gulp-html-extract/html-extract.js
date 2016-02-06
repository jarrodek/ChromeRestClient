/**
 * Extract HTML text.
 */
var cheerio = require("cheerio"),
  gutil = require("gulp-util"),
  PluginError = gutil.PluginError,
  through2 = require("through2"),
  PLUGIN_NAME = "html-text";

/**
 * ## `html-extract`
 *
 * Extract text from HTML.
 *
 * @param {Object} opts     Options
 * @param {String} opts.sel Element selector [Default: `script`] (_optional_)
 */
module.exports = function (opts) {
  opts = opts || {};
  var sel = opts.sel || "script";

  var stream = through2.obj(function (file, enc, callback) {
    var self = this;
    var contentExtracted;
    var els;

    function hasChildren(el) {
      return el.children.length > 0;
    }

    if (file.isStream()) {
      return stream.emit("error",
        new PluginError(PLUGIN_NAME, "Streams are not supported!"));
    }

    if (file.isBuffer()) {
      contentExtracted = cheerio.load(file.contents.toString("utf8"));
      els = contentExtracted(sel);
      [].forEach.call(els, function (el, i) {
        if (hasChildren(el)) {
          self.push(new gutil.File({
            // Name: id or tag + index.
            path: file.path + "-" + (el.attribs.id || el.tagName + "-" + i),
            contents: new Buffer(el.children[0].data)
          }));
        }
      });
      callback();
    }
  });

  return stream;
};
