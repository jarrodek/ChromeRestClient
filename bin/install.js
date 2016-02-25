#! /usr/bin/env node
var shell = require('shelljs');

var chromeCmd = '';
switch (process.platform) {
  case 'linux':
  case 'freebsd':
    chromeCmd = 'google-chrome';
    break;
  case 'sunos':
    chromeCmd = '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome';
    break;
  case 'win32':
    chromeCmd = 'chrome.exe';
    break;
  default:
    shell.echo('Unsupported platform');
    shell.exit(1);
    break;
};
var chromeExec = shell.which(chromeCmd);
if (!chromeExec) {
  shell.echo('This script requires Google chrome to be installed.');
  shell.exit(1);
}
var currentDirectory = shell.pwd();
var cmd = `${chromeCmd} --silent-launch --load-and-launch-app="${currentDirectory}" &`;

shell.exec(cmd);
