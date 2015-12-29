(function () {
'use strict';

var Unibabel = window.Unibabel;

//UTF-8
var pass = true;
var references = {
  string: "I ½ ♥ 𩶘"
, array: [ 73, 32, 194, 189, 32, 226, 153, 165, 32, 240, 169, 182, 152 ]
, hex: "4920c2bd20e299a520f0a9b698"
, base64: "SSDCvSDimaUg8Km2mA=="
, base32: 'JEQMFPJA4KM2KIHQVG3JQ==='
};
references.buffer = new Uint8Array(references.array);
var binrefs = {
  // Note that the binary string "ÿâó<86>Î<93>k" can't be serialized to text
  array: [ 255, 226, 26, 243, 134, 206, 147, 107 ]
, hex: "ffe21af386ce936b"
, base64: "/+Ia84bOk2s="
};
binrefs.buffer = new Uint8Array(binrefs.array);

var str = references.string;
var buf = Unibabel.utf8ToBuffer(references.string);
var base64 = Unibabel.bufferToBase64(references.buffer);
var hex = Unibabel.bufferToHex(references.buffer);
var b32 = Unibabel.bufferToBase32(references.buffer);

function buffersAreEqual(buf1, buf2) {
  if (buf1.length !== buf2.length) {
    return false;
  }
  return Array.prototype.every.call(buf1, function (byte, i) {
    if (byte === buf2[i]) {
      return true;
    }
  });
}

// TODO compare buffer
if (!buffersAreEqual(buf, references.array)) {
  pass = false;
  console.warn('[FAIL] utf8 -> buffer', buf);
}
if (base64 !== references.base64) {
  pass = false;
  console.warn('[FAIL] utf8 -> base64', base64);
}
if (hex !== references.hex) {
  pass = false;
  console.warn('[FAIL] utf8 -> hex', hex);
}


// binary
var bytes = binrefs.array;
buf = new Uint8Array(bytes);
str = Unibabel.bufferToBinaryString(buf);
base64 = Unibabel.bufferToBase64(buf);
hex = Unibabel.bufferToHex(buf);

// This can't be properly tested because binary strings can't be parsed
// if (str !== "ÿâóÎk") {
//   pass = false;
//   console.log('[FAIL] binary -> str', str);
// }
if (binrefs.base64 !== base64) {
  pass = false;
  console.warn('[FAIL] binary -> base64', base64);
}
if (binrefs.hex !== hex) {
  pass = false;
  console.warn('[FAIL] binary -> hex', hex);
}

//
// Base32
//
b32 = Unibabel.bufferToBase32(references.buffer);
if (references.base32 !== b32) {
  pass = false;
  console.warn('[FAIL] binary -> base32', references.base32, '!==', b32);
}
buf = Unibabel.base32ToBuffer(references.base32);
if (!buffersAreEqual(buf, references.buffer)) {
  pass = false;
  console.warn('[FAIL] base32 -> binary', references.buffer, '!==', buf);
}

if (pass) {
  console.info('[PASS] :-D');
}

}());
