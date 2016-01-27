'use strict';

// jshint unused:false
export function Comment(comment) {
  Object.defineProperty(this, 'comment', {
    enumerable: true,
    writable: true,
    value: comment
  });
}
