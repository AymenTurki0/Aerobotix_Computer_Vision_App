const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  runPythonGame: () => ipcRenderer.invoke("run-python-game"),
});
