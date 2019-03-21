# Advanced Rest Client Application - the Chrome App


Welcome to the ARC's project repository. Note that Chrome apps currently works with Chrome OS only.
For desktop client, please, refer to [arc-electron repository](https://github.com/advanced-rest-client/arc-electron/releases).

## Installation

Install application from [Chrome Web Store](https://chrome.google.com/webstore/detail/hgmloofddffdnphfgcellkdfbfbjeloo/).

## Status of the application

Initially after Chrome apps has been discarded from Chrome by Google I decided to drop support for Chrome version of the application and focus on desktop client only.
However, because Chrome version is still very popular and myself is using Chrome OS regularly I decided to resume support for this platform.

It is however still recommended to install desktop client as it has more capabilities and moin development will be focused on that version. Find latest desktop release here: https://github.com/advanced-rest-client/arc-electron/releases.

## Development

You are welcome to contribute to the project. To start developing use following instructions:

I assume you have [Node.js][1] already installed on your machine.

Start with forking the repository and then getting the code:

```sh
git clone https://github.com/[your username]/ChromeRestClient.git
```

When ready go to the directory:

```sh
cd ChromeRestClient
```

Then install dependencies:

```shell
npm install && bower install
```

Note: bower is being replaced with npm. This takes time. In 2019 whole project will migrate from HTML imports to ESM imports and only npm will be used.

The app is ready to develop. Sources are located in `app/` directory.
Go to `chrome://extensions` page, select "Developer mode", and then "Load unpacked". When file dialog opens select `app/` folder from application directory.


Thanks for testing and don't forget to file an issue report if you find a bug.

You are also welcome to send a pull request with bug fixes. Please, read [CONTRIBUTING.md](CONTRIBUTING.md) file first.

## CSP troubles

If you run into trouble caused by CSP environment you can run following command:

```sh
node tasks/prepare-app.js
```

 [1]: https://docs.npmjs.com/getting-started/installing-node "Install Node.js"
