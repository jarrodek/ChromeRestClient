/* global Zlib, importScripts, self */
importScripts('../zlib/zlib_and_gzip.min.js');

self.addEventListener('message', function(e) {
  let buffer = e.data.buffer;
  const compression = e.data.compression;
  let inflate;
  if (compression.indexOf('gzip') !== -1) {
    inflate = new Zlib.Gunzip(buffer);
    buffer = inflate.decompress();
  } else if (compression.indexOf('deflate') !== -1) {
    inflate = new Zlib.Inflate(buffer);
    buffer = inflate.decompress();
  }
  self.postMessage(buffer);
});
