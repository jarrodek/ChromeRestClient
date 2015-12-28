'use strict';

console.warn("Please don't use Unibabel in node.js. If you think you really think you have a valid use case please report it at https://github.com/coolaj86/unibabel-js/issues/new");
throw new Error("[unibabel] you're doing it wrong");

/*
var data = 'I ½ ♥ 💩';
var encoding = 'utf8';
var buf = new Buffer(data, encoding);
buf.toString('hex');
buf.toString('base64');
buf.toString('ascii');
buf.toString('utf8');
buf.toString('binary'); // deprecated, do not use

var Base32 = require('thirty-two');
var b32 = Base32.encode(buf);
Base32.decode(buf);
*/
