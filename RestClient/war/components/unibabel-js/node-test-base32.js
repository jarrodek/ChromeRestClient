var base32 = require('thirty-two');
var str = "I ½ ♥ 𩶘";
var buf = new Buffer(str, 'utf8');
console.log('charLen', 7);
console.log('byteLen', buf.byteLength, JSON.stringify(buf.toString('utf8')));
var b32 = base32.encode(buf); // to base32
console.log('encoded', b32.toString('utf8'));
console.log('decoded', base32.decode(b32).toString('utf8'));
