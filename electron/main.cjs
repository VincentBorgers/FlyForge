const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1200,
    minHeight: 700,
    autoHideMenuBar: true,
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
  const prodFile = path.join(__dirname, '..', 'dist', 'index.html');

  win.webContents.on('did-fail-load', (_event, code, desc) => {
    dialog.showErrorBox('FlyForge Studio load error', `Renderer kon niet laden (${code}): ${desc}`);
  });

  if (!app.isPackaged) {
    win.loadURL(devUrl);
  } else {
    win.loadFile(prodFile);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
