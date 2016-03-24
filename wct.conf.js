#! /usr/bin/env node

var path = require('path');

var ret = {
  'verbose': true,
  'suites': ['app/test'],
  'webserver': {
    'pathMappings': []
  },
  plugins: {
    local: {
      browsers: ['chrome']
    }
  }
};

var mapping = {};
var rootPath = (__dirname).split(path.sep).slice(-1)[0];
mapping['/components/' + rootPath  + '/app/bower_components'] = 'bower_components';
ret.webserver.pathMappings.push(mapping);
console.log(ret.webserver.pathMappings[0]);
module.exports = ret;
//{ '/components/ChromeRestClient/app/bower_components': 'bower_components' }
