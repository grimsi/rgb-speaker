const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 627, height: 616, resizable: true});
    mainWindow.setMenu(null);

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow);

// Max OSX specific
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});


// Max OSX specific
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});