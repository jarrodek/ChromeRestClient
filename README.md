Advanced Rest Client Application - the Chrome App
=================

This branch is to update the app to the Chrome packaged apps.
It's in active development **and it's not working yet**.

## Developer preview
I assume you have [Node.js][1] already installed on your machine.

Start with getting the code
```shell
git clone https://github.com/jarrodek/ChromeRestClient.git
```

When ready switch to a `chrome-app` branch
```shell
git checkout chrome-app
```

Next install dependencies:
```shell
npm install && bower install
```
Take a coffee break. It will take a while...

After you have all dependencies installed the is a very important step: [crisper][2] the bower components directory. Chrome Apps require strict CSP compliance. It means that no JavaScript code can be included into HTML file. `paper-*` and `iron-*` elements, however, have a lot of JavaScript code inside HTML that we need to move to external file.

Run following command
```shell
gulp crisper-bower
```

Well, the app is ready to develop / preview. You can either load the app from [chrome://extensions/][3] page (check "Developer mode" check box) or run command:
```shell
npm run arc
```

Thanks for testing and don't forget to file an issue report if you find a bug.

 [1]: https://docs.npmjs.com/getting-started/installing-node "Install Node.js"
 [2]: https://github.com/PolymerLabs/crisper "Crisper for Polymer"
 [3]: chrome://extensions/ "Apps listing"
