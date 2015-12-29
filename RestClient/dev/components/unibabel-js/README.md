Unibabel
========

Minimalistic **Base64**, **TypedArrays**, and **UTF-8** / **Unicode** conversions in Browser (and Node) JavaScript. Optional add-on support for **hex** and **base32**.

See <https://coolaj86.com/articles/base64-unicode-utf-8-javascript-and-you/>

See also

  * [TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder/encode) / [TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/decode)
  * [DateView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
  * [text-encoding](https://github.com/inexorabletash/text-encoding)
  * [TextEncoderLite (based on Buffer)](https://github.com/coolaj86/TextEncoderLite/tree/litest)
  * [TextEncoderLite (based on text-encoding)](https://github.com/coolaj86/TextEncoderLite/tree/lite)
  * [Beatgammit's base64-js](https://github.com/beatgammit/base64-js)

Quick Note to Node.js Users
------------------------

You SHOULD NOT use this module. You already have [`Buffer`](https://nodejs.org/api/buffer.html) and [`thirty-two`](https://github.com/chrisumbel/thirty-two):

```javascript
var buf = new Buffer('I ½ ♥ 💩', 'utf8');
buf.toString('hex');
buf.toString('base64');
buf.toString('ascii');
buf.toString('utf8');
buf.toString('binary'); // deprecated, do not use
```

API
===

```javascript
// TypedArray <--> UTF8
var uint8Array = Unibabel.strToUtf8Arr(str);
var str = Unibabel.utf8ArrToStr(uint8Array);

// TypedArray <--> Base64
var base64 = Unibabel.arrToBase64(uint8Array)
var uint8Array = Unibabel.base64ToArr(base64)
```

**Normal APIs**

* utf8ToBuffer(utf8str) => array
* bufferToUtf8(array) => string

* utf8ToBase64(utf8str) => base64
* base64ToUtf8(base64) => string

* bufferToBase64(array) => base64
* base64ToBuffer(base64) => array

**Hex APIs**

`unibabel.hex.js`

* hexToBuffer(hexstr) => array
* bufferToHex(array) => hexstr

**Base32 APIs**

`unibabel.base32.js`

* base32ToBuffer(b32str) => array
* bufferToBase32(array) => b32str

**Helper APIs**

* utf8ToBinaryString(utf8str) => binstr
* binaryStringToUtf8(binstr) => utf8str
* bufferToBinaryString(buffer) => binstr
* binaryStringToBuffer(binstr) => array

Examples
========

```javascript
// Base64

var myArray = Unibabel.base64ToArr("QmFzZSA2NCDigJQgTW96aWxsYSBEZXZlbG9wZXIgTmV0d29yaw=="); // "Base 64 \u2014 Mozilla Developer Network"
var myBuffer = Unibabel.base64ToArr("QmFzZSA2NCDigJQgTW96aWxsYSBEZXZlbG9wZXIgTmV0d29yaw==").buffer; // "Base 64 \u2014 Mozilla Developer Network"

console.log(myBuffer.byteLength);

// Crazy Unicode

var sMyInput = "I'm a ☢ ☃ that plays 𝄢 guitar and spea̧͈͖ks Ar̽̾̈́͒͑ ̶̧̨̱̹̭̯ͧ̾ͬC̷̙̲̝͖ͭ̏ͥͮ͟Oͮ͏̮̪̝͍M̲̖͊̒ͪͩͬ̚̚͜!";
var aMyUTF8Input = Unibabel.strToUtf8Arr(sMyInput);
var sMyBase64 = Unibabel.arrToBase64(aMyUTF8Input);

alert(sMyBase64);

var aMyUTF8Output = Unibabel.base64ToArr(sMyBase64);
var sMyOutput = Unibabel.utf8ArrToStr(aMyUTF8Output);

alert(sMyOutput);
```

License
=======

* `index.js` and `unibabel.hex.js` are dual-licensed as Apache 2.0 and MIT.
* `unibabel.base32.js` is a modified version of [thirty-two](https://github.com/chrisumbel/thirty-two) and is therefore licensed MIT.

Some parts of the code were taken from MDN, which Mozilla has licensed in the Public Domain,
which means that I am at liberty to re-license my copy under the Apache 2 and MIT licenses.

See <https://developer.mozilla.org/en-US/docs/MDN/About#Copyrights_and_licenses>

ChangeLog
====

v2.1.0
------

Added `unibabel.base32.js`

v2.0.0
------

The new implementation is binary compatible with node.js, TextEncoder,
and other more-common UTF-8 encodings.

It is also based on DOM APIs which result in much less code and are still
backwards compatible all the way back to IE6 (not on purpose, just that
it happens to work).

See <https://coolaj86.com/articles/base64-unicode-utf-8-javascript-and-you/>

v1.0.0
------

This version was based on the work by good folks at the MDN, however,
the UTF-8 conversion was not byte-compatible with other UTF-8 conversions
(such as node.js and TextEncoder), so don't use it.
See <https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding>
