const electron = require('electron');

// Module to control application life.
const {app, BrowserWindow, ipcMain, Menu} = electron;

const isDev = require('electron-is-dev');

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
    backgroundColor: '#FFFFFF'
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // win.loadURL('http://localhost:4200/');

  win.on('closed', function () {
    win = null
  });
}

app.on('ready', () => {

  if (!isDev) {
    // Get template for default menu
    const menu = createMenuTemplate();

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

function createMenuTemplate() {
  return [
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        },
      ]
    }
  ];
}
