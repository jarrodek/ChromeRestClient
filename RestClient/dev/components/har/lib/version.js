'use strict';

// jshint unused:false
export function Version(version) {
  if (!version) {
    throw new Error('version required');
  }

  Object.defineProperty(this, 'version', {
    enumerable: true,
    writable: true,
    value: version.toString()
  });
}
