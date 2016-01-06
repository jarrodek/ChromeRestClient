var str = "I ½ ♥ 𩶘";
var buf = new Buffer(str);
var base64 = buf.toString('base64');
var hex = buf.toString('hex');
var bytes = Array.prototype.map.call(buf, function (byte) {
  return byte;
});

console.log('');
console.log('UTF-8');
console.log(str);
console.log(base64);
console.log(hex);
console.log('[ ' + bytes.join(', ') + ' ]');
console.log('');

// Array.prototype.map.call(crypto.randomBytes(8), function (b) { return b; });
var bytes = [ 255, 226, 26, 243, 134, 206, 147, 107 ];
buf = new Buffer(bytes);
str = buf.toString('binary');
base64 = buf.toString('base64');
hex = buf.toString('hex');

console.log('');
console.log('binary');
console.log(str);
console.log(base64);
console.log(hex);
console.log(bytes);
console.log('');
