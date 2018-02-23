const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const ipcMain = electron.ipcMain;

const {shell} = require('electron');

const path = require('path');
const url = require('url');

const {requestBucketList} = require('./qiniu');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 930,
    height: 700,
    minWidth: 930,
    minHeight: 500,
    backgroundColor: '#FFFFFF',
    icon: `file://${__dirname}/dist/asset/logo.png`,
    // minWidth: 800,
    // minHeight: 600
  });

  // win.loadURL(url.format({
  //     pathname: path.join(__dirname, 'build/index.html'),
  //     protocol: 'file:',
  //     slashes: true
  // }));

  win.loadURL('http://localhost:4200/');

  // win.webContents.openDevTools();

  win.on('closed', function () {
    win = null
  });
}

app.on('ready', createWindow);

app.on('all-window-closed', function () {
  if (app.platform !== 'darwin') {
    app.quit()
  }
});

app.on('active', function () {
  if (win == null) {
    createWindow()
  }
});

ipcMain.on('request-bucket-list', (event, arg) => {
  requestBucketList(arg, (error, data) => {
    event.sender.send('request-bucket-list-callback', {
      error: error,
      data: data
    });
  });
});

ipcMain.on('shell', (event, arg) => {
  if (arg.openUrl) {
    shell.openExternal(arg.openUrl);
  }
});
