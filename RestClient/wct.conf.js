var path = require('path');

var ret = {
  'suites': ['test'],
  'webserver': {
    'pathMappings': []
  }
};

var mapping = {};
var rootPath = (__dirname).split(path.sep).slice(-1)[0];

mapping['/components/' + rootPath  +
'/war/components'] = 'bower_components';

ret.webserver.pathMappings.push(mapping);

module.exports = ret;