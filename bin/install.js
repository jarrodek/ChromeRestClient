#! /usr/bin/env node
var shell = require('shelljs');
var path = require('path');

var packageDirectory = path.join(shell.pwd(), 'app');
var chromeCmd = '';

function isInstalled(program) {
  var chromeExec = shell.which(program);
  if (!chromeExec) {
    shell.echo('This script requires Google chrome to be installed.');
    shell.exit(0);
  }
}
function runApp() {
  var cmd = `${chromeCmd} --silent-launch --load-and-launch-app="${packageDirectory}" &`;
  shell.exec(cmd);
}

function runAppOsx() {
  var cmd = 'open /Applications/Google\\ Chrome.app --args --silent-launch ';
  cmd += `--load-and-launch-app="${packageDirectory}" &`;
  shell.exec(cmd);
}

var osx = false;
switch (process.platform) {
  case 'linux':
  case 'freebsd':
  case 'sunos':
    chromeCmd = 'google-chrome';
    break;
  case 'darwin':
    osx = true;
    break;
  case 'win32':
    chromeCmd = 'chrome.exe';
    break;
  default:
    shell.echo('Unsupported platform');
    shell.exit(0);
    break;
}
if (!osx) {
  isInstalled(chromeCmd);
  runApp();
} else {
  runAppOsx();
}
