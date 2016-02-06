var browserstackApi = require( "./api" ),
	browserstackScreenshot = require( "./screenshot" );

module.exports = {
	createClient: browserstackApi.createClient,
	createScreenshotClient: browserstackScreenshot.createClient
};
