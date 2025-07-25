// Modules to control application life and create native browser window
const { app, shell, BrowserWindow, ipcMain, dialog, protocol, clipboard } = require('electron')
const path = require('path')
const { electronApp, optimizer } = require('@electron-toolkit/utils')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    resizable: true,
    ...(process.platform === 'linux'
      ? {
          icon: path.join(__dirname, '../resources/icon.png')
        }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'))
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // ========================================================
  // === POCZĄTEK ZMIAN: Rejestracja protokołu `app-file` ===
  // ========================================================
  protocol.registerFileProtocol('app-file', (request, callback) => {
    const url = request.url.substring('app-file:///'.length)
    callback({ path: path.normalize(decodeURI(url)) })
  })
  // ========================================================
  // === KONIEC ZMIAN ===
  // ========================================================

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('open-file-dialog', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Obrazy', extensions: ['jpg', 'png', 'gif', 'jpeg'] },
      { name: 'Wszystkie pliki', extensions: ['*'] }
    ]
  })
  return canceled ? null : filePaths[0]
})
// Na końcu pliku main.js

ipcMain.handle('copy-to-clipboard', (event, text) => {
    clipboard.writeText(text);
    return { success: true };
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// // Modules to control application life and create native browser window
// const { app, shell, BrowserWindow,ipcMain, dialog, protocol } = require('electron')
// const path = require('path')
// const { electronApp, optimizer } = require('@electron-toolkit/utils')

// function createWindow() {
//   // Create the browser window.
//   const mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     show: false,
//     autoHideMenuBar: true,
//     resizable: true,
//     ...(process.platform === 'linux'
//       ? {
//           icon: path.join(__dirname, '../resources/icon.png')
//         }
//       : {}),
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//       sandbox: false,
//       contextIsolation: true,
//       nodeIntegration: false
//     }
//   })

//   mainWindow.on('ready-to-show', () => {
//     mainWindow.show()
//   })

//   mainWindow.webContents.setWindowOpenHandler((details) => {
//     shell.openExternal(details.url)
//     return { action: 'deny' }
//   })

//   // and load the index.html of the app.
//   mainWindow.loadFile(path.join(__dirname, 'index.html'))
// }

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.whenReady().then(() => {
//   // Set app user model id for windows
//   electronApp.setAppUserModelId('com.electron')

//   // Default open or close DevTools by F12 in development
//   // and ignore CommandOrControl + R in production.
//   // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
//   app.on('browser-window-created', (_, window) => {
//     optimizer.watchWindowShortcuts(window)
//   })

//   createWindow()

//   app.on('activate', function () {
//     // On macOS it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (BrowserWindow.getAllWindows().length === 0) createWindow()
//   })
// })

// // Quit when all windows are closed, except on macOS. There, it's common
// // for applications and their menu bar to stay active until the user quits
// // explicitly with Cmd + Q.
// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

// ipcMain.handle("open-file-dialog", async () => {
//   const { canceled, filePaths } = await dialog.showOpenDialog({
//     properties: ["openFile"],
//     filters: [
//       { name: "Obrazy", extensions: ["jpg", "png", "gif", "jpeg"] },
//       { name: "Wszystkie pliki", extensions: ["*"] },
//     ],
//   });
//   return canceled ? null : filePaths[0];
// });

// // In this file you can include the rest of your app's specific main process
// // code. You can also put them in separate files and require them here.
