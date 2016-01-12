'use strict';

// jshint unused:false
export const util = {
  toObject: function(array) {
    return array.reduce((obj, pair) => {
      if (obj[pair.name] === undefined) {
        obj[pair.name] = pair.value;
        return obj;
      }

      // convert to array
      let arr = [
        obj[pair.name],
        pair.value
      ];

      obj[pair.name] = arr;

      return obj;
    }, {});
  },

  toArray: function(obj) {
    return Object.keys(obj).map((name) => {
      return {
        name: name,
        value: obj[name]
      };
    });
  },

  str2ab: function(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  },

  makeid: function(size) {
    if (typeof size !== 'number') {
      throw new Error('Size must be a number');
    }
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < size; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
};
