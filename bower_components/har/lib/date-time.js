'use strict';

// jshint unused:false
export function DateTime(name, value) {
  var date = new Date();

  switch (Object.prototype.toString.call(value)) {
    case '[object Undefined]':
      date = undefined;
      break;

    case '[object Date]':
      date = value;
      break;

    case '[object String]':
      date.setTime(Date.parse(value));
      break;

    case '[object Number]':
      date.setTime(value);
      break;
  }

  Object.defineProperty(this, name || 'dateTime', {
    enumerable: true,
    writable: true,
    value: date ? date.toISOString() : undefined
  });
}
