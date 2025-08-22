const { app, BrowserWindow, ipcMain } = require("electron");
const { PythonShell } = require("python-shell");
const path = require("path");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    // Absolute path to icon
    icon: "C:/Users/LENOVO/Desktop/Aerobotix_App/assets/1.ico",
    webPreferences: {
      // Absolute path to preload.js
      preload: "C:/Users/LENOVO/Desktop/Aerobotix_App/preload.js",
    },
  });

  // Absolute path to starting page
  mainWindow.loadFile(
    "C:/Users/LENOVO/Desktop/Aerobotix_App/src/welcome.html"
  );
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Handle Python execution with absolute paths
ipcMain.handle("run-python-game", async () => {
  return new Promise((resolve, reject) => {
    let pyshell = new PythonShell(
      "C:/Users/LENOVO/Desktop/Aerobotix_App/src/fruit-ninja-with-computer-vision-main/main.py",
      {
        pythonPath:
          "C:/Users/LENOVO/AppData/Local/Programs/Python/Python312/python.exe",
      }
    );

    pyshell.on("message", (message) => {
      console.log("Python says:", message);
    });

    pyshell.end((err) => {
      if (err) {
        console.error("Python failed:", err);
        reject(err);
      } else resolve("Game finished!");
    });
  });
});
