Advanced Rest Client Application - the Chrome App
=================

[![Stories in Ready](https://badge.waffle.io/jarrodek/ChromeRestClient.svg?label=ready&title=Ready)](http://waffle.io/jarrodek/ChromeRestClient)

## Developent
I assume you have [Node.js][1] already installed on your machine.

Start with getting the code
```shell
git clone https://github.com/jarrodek/ChromeRestClient.git
```

When ready go to the directory:
```shell
cd ChromeRestClient
```

Then install dependencies:
```shell
npm install && bower install
```
Take a coffee break. It will take a while... You can also install [gifi][gifi], a wrapper for `npm install` that will display a random gif while waiting for npm:

![](https://raw.githubusercontent.com/vdemedes/gifi/master/media/demo.gif)


Well, the app is ready to develop. You can either load the app from chrome://extensions/ page (check "Developer mode" check box) or run command:
```shell
npm run arc
```

Thanks for testing and don't forget to file an issue report if you find a bug.

## App design docs for developers
Please, read wiki in this repository.

## CSP troubles
If you run into trouble caused by CSP environment you can run following command:
```shell
gulp crisper-bower
```

This will [crisper][2] the `bower_components` directory and make the app works again.

 [1]: https://docs.npmjs.com/getting-started/installing-node "Install Node.js"
 [2]: https://github.com/PolymerLabs/crisper "Crisper for Polymer"
 [gifi]: https://github.com/vdemedes/gifi "watch GIFs while running npm install"
