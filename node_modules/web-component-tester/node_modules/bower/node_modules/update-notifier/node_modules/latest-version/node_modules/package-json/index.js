'use strict';
var got = require('got');
var registryUrl = require('registry-url');
var rc = require('rc');
var semver = require('semver');

module.exports = function (name, version) {
	var scope = name.split('/')[0];
	var url = registryUrl(scope) +
		encodeURIComponent(name).replace(/^%40/, '@');
	var npmrc = rc('npm');
	var token = npmrc[scope + ':_authToken'] || npmrc['//registry.npmjs.org/:_authToken'];
	var headers = {};

	if (token) {
		if (process.env.NPM_TOKEN) {
			token = token.replace('${NPM_TOKEN}', process.env.NPM_TOKEN);
		}

		headers.authorization = 'Bearer ' + token;
	}

	return got(url, {
		json: true,
		headers: headers
	})
		.then(function (res) {
			var data = res.body;

			if (version === 'latest') {
				data = data.versions[data['dist-tags'].latest];
			} else if (version) {
				if (!data.versions[version]) {
					var versions = Object.keys(data.versions);
					version = semver.maxSatisfying(versions, version);

					if (!version) {
						throw new Error('Version doesn\'t exist');
					}
				}

				data = data.versions[version];

				if (!data) {
					throw new Error('Version doesn\'t exist');
				}
			}

			return data;
		})
		.catch(function (err) {
			if (err.statusCode === 404) {
				throw new Error('Package doesn\'t exist');
			}

			throw err;
		});
};
