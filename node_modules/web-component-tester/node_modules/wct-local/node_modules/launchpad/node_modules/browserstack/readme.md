# node-browserstack

A node.js JavaScript client for working with [BrowserStack](http://browserstack.com) through its [REST API](https://github.com/browserstack/api) and [Screenshots API](https://www.browserstack.com/screenshots/api).

Support this project by [donating on Gratipay](https://gratipay.com/scottgonzalez/).

## Installation

```
npm install browserstack
```

## Usage

```javascript
var BrowserStack = require( "browserstack" );

// REST API
var client = BrowserStack.createClient({
	username: "foo",
	password: "p455w0rd!!1"
});

client.getBrowsers(function( error, browsers ) {
	console.log( "The following browsers are available for testing" );
	console.log( browsers );
});

// Screenshots API
var screenshotClient = BrowserStack.createScreenshotClient({
	username: "foo",
	password: "p455w0rd!!1"
});

screenshotClient.getBrowsers(function( error, browsers ) {
	console.log( "The following browsers are available for screenshots" );
	console.log( browsers );
});
```

## API

### Objects

#### browser objects

A common pattern in the API is a "browser object" which is just a plain object with the following properties:

* `os`: The operating system.
* `os_version`: The operating system version.
* `browser`: The browser name.
* `browser_version`: The browser version.
* `device`: The device name.

A browser object may only have one of `browser` or `device` set; which property is set will depend on `os`.

#### worker objects

Worker objects are extended [browser objects](#browser-objects) which contain the following additional properties:

* `id`: The worker id.
* `status`: A string representing the current status of the worker.
	* Possible statuses: `"running"`, `"queue"`.

#### screenshot job objects

Screenshot job objects are plain objects which contain the following properties:

* `job_id`: The id of the job.
* `state`: The state of the job.
* `win_res`: The screen resolution for browsers running on Windows. May be one of: `"1024x768"`, `"1280x1024"`.
* `mac_res`: The screen resolution for browsers running on Mac OS X. May be one of: `"1024x768"`, `"1280x960"`, `"1280x1024"`, `"1600x1200"`, `"1920x1080"`.
* `orientation`: The screen orientation for devices. May be one of: `"portrait"`, `"landscape"`.
* `quality`: The quality of the screenshot. May be one of: `"original"`, `"compressed"`.
* `wait_time`: The number of seconds to wait before taking the screenshot. May be one of: `2`, `5`, `10`, `15`, `20`, `60`.
* `local`: Boolean indicating whether a local testing connection should be used.
* `browsers`: A collection of [browser objects](#browser-objects) indicating which browsers and devices to take screenshots with.

### screenshot state objects

Screenshot state objects are extended [browser objects](#browser-objects) which contain the following additional properties:

* `id`: The id of the screenshot object.
* `state`: The state of the screenshot.
* `url`: The URL of the page the screenshot was generated from.
* `thumb_url`: The URL for the screenshot thumbnail.
* `image_url`: The URL for the full-size screenshot.
* `created_at`: The timestamp indicating when the screenshot was generated.

### REST API v4

*Note: For earlier versions of the API, please see [the wiki](https://github.com/scottgonzalez/node-browserstack/wiki/API).*

#### BrowserStack.createClient( settings )

Creates a new client instance.

* `settings`: A hash of settings that apply to all requests for the new client.
	* `username`: The username for the BrowserStack account.
	* `password`: The password for the BrowserStack account.
	* `version` (optional; default: `4`): Which version of the BrowserStack API to use.
	* `server` (optional; default: `{ host: "api.browserstack.com", port: 80 }`): An object containing `host` and `port` to connect to a different BrowserStack API compatible service.

#### client.getBrowsers( callback )

Gets the list of available browsers.

* `callback` (`function( error, browsers )`): A callback to invoke when the API call is complete.
	* `browsers`: An array of [browser objects](#browser-objects).

#### client.createWorker( settings, callback )

Creates a worker.

* `settings`: A hash of settings for the worker (an extended [browser object](#browser-objects)).
	* `os`: See [browser object](#browser-objects) for details.
	* `os_version`: See [browser object](#browser-objects) for details.
	* `browser`: See [browser object](#browser-objects) for details.
	* `browser_version`: See [browser object](#browser-objects) for details.
	* `device`: See [browser object](#browser-objects) for details.
	* `url` (optional): Which URL to navigate to upon creation.
	* `timeout` (optional): Maximum life of the worker (in seconds). Maximum value of `1800`. Specifying `0` will use the default of `300`.
	* `name` (optional): Provide a name for the worker.
	* `build` (optional): Group workers into a build.
	* `project` (optional): Provide the project the worker belongs to.
* `callback` (`function( error, worker )`): A callback to invoke when the API call is complete.
	* `worker` A [worker object](#worker-objects).

*Note: A special value of `"latest"` is supported for `browser_version`, which will use the latest stable version.*

#### client.getWorker( id, callback )

Gets the status of a worker.

* `id`: The id of the worker.
* `callback` (`function( error, worker )`): A callback to invoke when the API call is complete.
	* `worker`: A [worker object](#worker-objects).

#### client.changeUrl( id, options, callback )

Change the URL of a worker.

* `id`: The id of the worker.
* `options`: Configuration for the URL change.
	* `url`: The new URL to set.
	* `timeout` (optional): Set a new timeout for this worker, see [createWorker](#client.CreateWorker) for details.
* `callback` (`function( error, data )`): A callback to invoke when the API call is complete.
	* `data`: An object with a `message`, confirming the URL change.

#### client.terminateWorker( id, callback )

Terminates an active worker.

* `id`: The id of the worker to terminate.
* `callback` (`function( error, data )`): A callback to invoke when the API call is complete.
	* `data`: An object with a `time` property indicating how long the worker was alive.

#### client.getWorkers( callback )

Gets the status of all workers.

* `callback` (`function( error, workers )`): A callback to invoke when the API call is complete.
	* `workers`: An array of [worker objects](#worker-objects).

#### client.takeScreenshot( id, callback )

Take a screenshot at current state of worker.

* `callback` (`function( error, data )`): A callback to invoke when the API call is complete.
	* `data`: An object with a `url` property having the public url for the screenshot.

#### client.getLatest( browser, callback )

Gets the latest version of a browser.

* `browser`: Which browser to get the latest version for. See [browser object](#browser-objects) for details.
* `callback` (`function( error, version )`): A callback to invoke when the version is determined.
	* `version`: The latest version of the browser.

*Note: Since mobile devices do not have version numbers, there is no latest version.*

#### client.getLatest( callback )

Gets the latest version of all browsers.

* `callback` (`function( error, versions )`): A callback to invoke when the versions are determined.
	* `versions`: A hash of browser names and versions.

#### client.getApiStatus( callback )

* `callback` (`function( error, status )`): A callback to invoke when the status is determined.
	* `used_time`: Time used so far this month, in seconds.
	* `total_available_time`: Total available time, in seconds. Paid plans have unlimited API time and will receive the string `"Unlimited Testing Time"` instead of a number.
	* `running_sessions`: Number of running sessions.
	* `sessions_limit`: Number of allowable concurrent sessions.

### Screenshots API

#### BrowserStack.createScreenshotClient( settings )

Creates a new client instance.

* `settings`: A hash of settings that apply to all requests for the new client.
	* `username`: The username for the BrowserStack account.
	* `password`: The password for the BrowserStack account.

#### screenshotClient.getBrowsers( callback )

Gets the list of available browsers.

* `callback` (`function( error, browsers )`): A callback to invoke when the API call is complete.
	* `browsers`: An array of [browser objects](#browser-objects).

#### screenshotClient.generateScreenshots( options, callback )

Creates a job to take screenshots.

* `options`: A hash of settings for the screenshots. See [screenshot job objects](#screenshot-job-objects) for details.
	* `browsers`: A collection of [browser objects](#browser-objects) indicating which browsers and devices to take screenshots with.
	* `win_res` (optional): Only required if taking a screenshot on Windows. Defaults to `"1024x768"`.
	* `mac_res` (optional): Only required if taking a screenshot on Mac OS X. Defaults to "1024x768"`.
	* `orientation` (optional): Defaults to `"portrait"`.
	* `quality` (optional): Defaults to `"compressed"`.
	* `wait_time` (optional): Defaults to `5`.
	* `local` (optional): Defaults to `false`.
* `callback` (`function( error, job )`): A callback to invoke when the API call is complete.
	* `job`: A [screenshot job object](#screenshot-job-objects) containing [screenshot state objects](#screenshot-state-objects) in place of [browser objects](#browser-objects).

#### screenshotClient.getJob( id, callback )

Gets details about the current status of a screenshot job.

* `id`: The id of the job.
* `callback` (`function( error, job )`): A callback to invoke when the API call is complete.
	* `job`: A [screenshot job object](#screenshot-job-objects) containing [screenshot state objects](#screenshot-state-objects) in place of [browser objects](#browser-objects).

## License

Copyright Scott González. Released under the terms of the MIT license.

---

Support this project by [donating on Gratipay](https://gratipay.com/scottgonzalez/).
