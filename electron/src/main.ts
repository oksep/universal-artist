import {app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, Menu, shell} from 'electron';

import * as isDev from 'electron-is-dev';

import * as path from 'path';

import * as url from 'url';

import defaultMenu from './menu';

import {requestBucketList, requestUploadToken} from './qiniu';

let win: BrowserWindow;

function createWindow() {
    const option: BrowserWindowConstructorOptions = {
        width: 920,
        height: 750,
        minWidth: 930,
        minHeight: 500,
        backgroundColor: '#fff',
        frame: false,
        titleBarStyle: 'hidden',
    };

    win = new BrowserWindow(option);

    if (isDev) {
        win.loadURL('http://localhost:4200/');
    } else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, '../build/angular-render/index.html'),
            protocol: 'file:',
            slashes: true,
        }));
    }

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', () => {

    if (!isDev) {
        // Get template for default menu
        const menu = defaultMenu(app, shell);

        // Set top-level application menu, using modified template
        Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
    }

    createWindow();
});

app.on('window-all-closed', () => {

});

app.on('activate', () => {
    if (win == null) {
        createWindow();
    }
});

ipcMain.on('request-bucket-list', (event, arg) => {
    requestBucketList(arg, (error, data) => {
        event.sender.send('request-bucket-list-callback', {
            error,
            data,
        });
    });
});

ipcMain.on('request-upload-token', (event, arg) => {
    const token = requestUploadToken(arg);
    event.sender.send('request-upload-token-callback', token);
});
