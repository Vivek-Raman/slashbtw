const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  settings: {
    getAI: () => ipcRenderer.invoke("settings:ai:get"),
    setAI: (settings) => ipcRenderer.invoke("settings:ai:set", settings),
  },
});
