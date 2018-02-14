const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
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

function pushRepoByHttps() {
    // TODO
    // git push https://name:pwd@repo.git
}