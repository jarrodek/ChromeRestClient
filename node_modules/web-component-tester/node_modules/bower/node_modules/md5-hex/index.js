'use strict';
var crypto = require('crypto');

module.exports = function (input) {
	var hash = crypto.createHash('md5');

	var update = function (buf) {
		var inputEncoding = typeof buf === 'string' ? 'utf8' : undefined;
		hash.update(buf, inputEncoding);
	};

	if (Array.isArray(input)) {
		input.forEach(update);
	} else {
		update(input);
	}

	return hash.digest('hex');
};
