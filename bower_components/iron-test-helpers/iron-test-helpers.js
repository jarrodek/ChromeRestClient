(function(global) {
    'use strict';

    var TestHelpers = global.TestHelpers = global.TestHelpers || {};

    TestHelpers.flushAsynchronousOperations = flushAsynchronousOperations;
    TestHelpers.forceXIfStamp = forceXIfStamp;
    TestHelpers.fireEvent = fireEvent;
    TestHelpers.skipUnless = skipUnless;
  })(this);