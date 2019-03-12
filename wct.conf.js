#! /usr/bin/env node
const path = require('path');

const ret = {
  verbose: true,
  suites: ['app/test'],
  webserver: {
    'pathMappings': []
  },
  plugins: {
    local: {
      browsers: ['chrome']
    }
  }
};

const mapping = {};
const rootPath = (__dirname).split(path.sep).slice(-1)[0];
mapping['/components/' + rootPath + '/app/bower_components'] = 'bower_components';
ret.webserver.pathMappings.push(mapping);
console.log(ret.webserver.pathMappings[0]);
module.exports = ret;
