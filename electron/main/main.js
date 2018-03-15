"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const url = require("url");
const menu_1 = require("./menu");
const qiniu_1 = require("./qiniu");
let win;
function createWindow() {
    const option = {
        width: 920,
        height: 700,
        minWidth: 930,
        minHeight: 500,
        backgroundColor: '#eee',
        frame: false,
        titleBarStyle: 'hidden',
    };
    win = new electron_1.BrowserWindow(option);
    if (isDev) {
        win.loadURL('http://localhost:4200/');
    }
    else {
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
electron_1.app.on('ready', () => {
    if (!isDev) {
        // Get template for default menu
        const menu = menu_1.default(electron_1.app, electron_1.shell);
        // Set top-level application menu, using modified template
        electron_1.Menu.setApplicationMenu(electron_1.Menu.buildFromTemplate(menu));
    }
    createWindow();
});
electron_1.app.on('window-all-closed', () => {
});
electron_1.app.on('activate', () => {
    if (win == null) {
        createWindow();
    }
});
electron_1.ipcMain.on('request-bucket-list', (event, arg) => {
    qiniu_1.requestBucketList(arg, (error, data) => {
        event.sender.send('request-bucket-list-callback', {
            error,
            data,
        });
    });
});
//# sourceMappingURL=/Users/renyufeng/Documents/pro_azhong/azimghost/electron/main/main.js.map