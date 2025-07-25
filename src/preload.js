// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer, clipboard } = require('electron');
const path = require('path');
const { electronAPI } = require('@electron-toolkit/preload');

// Custom APIs for renderer
const api = {};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
    
    contextBridge.exposeInMainWorld('electronAPI', {
      openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
      copyText: (text) => ipcRenderer.invoke('copy-to-clipboard', text),
      readText: () => clipboard.readText(),
      getImgPath: (name) => path.join(process.resourcesPath, 'img', name)
    });

  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
