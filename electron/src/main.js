const electron = require('electron');

// electron
const {app, BrowserWindow, ipcMain, Menu, shell} = electron;

// 3rd part
const isDev = require('electron-is-dev');

// nodeJS
const path = require('path');
const url = require('url');

// custom
const defaultMenu = require('./menu');
const {requestBucketList} = require('./qiniu');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 930,
    height: 700,
    minWidth: 930,
    minHeight: 500,
    backgroundColor: '#FFFFFF'
  });

  if (isDev) {
    win.loadURL('http://localhost:4200/');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, '../build/angular-render/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  win.on('closed', function () {
    win = null
  });
}

app.on('ready', () => {

  if (!isDev) {
    // Get template for default menu
    const menu = defaultMenu(app, shell);

    // Set top-level application menu, using modified template
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
  }

  createWindow()
});

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
