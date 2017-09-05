'use strict';

var app = require('app');

var BrowserWindow = require('browser-window');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') app.quit();
});

app.on('ready', function () {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 500,
    transparent: true,
    frame: false,
  });
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
});
