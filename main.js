const {app, BrowserWindow} = require("electron");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#FFFFFF',
    icon: `file://${__dirname}/dist/asset/logo.png`
  });

  // win.loadURL(`file://${__dirname}/dist/index.html`);
  win.loadURL('http://localhost:4200/');

  win.webContents.openDevTools();

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
