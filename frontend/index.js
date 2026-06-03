const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn, exec } = require("child_process");
const fs = require("fs");
const { pathToFileURL } = require("url");

// CORRECCIÓN TOTAL DE INSTALACIÓN EN WINDOWS:
// Maneja los eventos de Squirrel de forma nativa y segura. Si se está instalando,
// crea los accesos directos de fondo y finaliza el proceso limpiamente sin romper nada.
if (require('electron-squirrel-startup')) {
  app.quit();
  return;
}

// DECLARACIÓN GLOBAL DE VARIABLES
let mainWindow = null;
let backendProcess = null;

function startBackend() {
  try {
    const isPackaged = app.isPackaged;
    let backendPath;

    if (isPackaged) {
      backendPath = path.win32.normalize(
        path.win32.join(process.resourcesPath, "facturation-api.exe")
      );
    } else {
      backendPath = path.win32.normalize(
        path.win32.join(__dirname, "..", "facturation", "dist", "facturation-api.exe")
      );
    }

    console.log("Iniciando backend en:", backendPath);

    if (!fs.existsSync(backendPath)) {
      console.error("No existe el binario en la ruta:", backendPath);
      return;
    }

    const customEnv = {
      ...process.env,
      ENV: isPackaged ? "production" : "development",
      USER_DATA_PATH: app.getPath("userData")
    };

    // CONFIGURACIÓN DE RED SEGURO PARA WINDOWS:
    // Cambiar 'ignore' por 'pipe' evita que Uvicorn muera por falta de buffers de consola.
    const spawnOptions = {
      env: customEnv,
      cwd: isPackaged
        ? process.resourcesPath
        : path.win32.normalize(path.win32.join(__dirname, "..", "facturation")),
      detached: false,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: false,
      windowsHide: false
    };

    backendProcess = spawn(backendPath, [], spawnOptions);

    backendProcess.on("error", (err) => {
      console.error("ERROR INICIANDO BACKEND:", err);
    });

    backendProcess.on("exit", (code) => {
      console.log("BACKEND CERRADO CON CÓDIGO:", code);
    });


    // ESCUCHAR EN TIEMPO REAL ERRORES EN LA APP EMPAQUETADA
    backendProcess.stdout.on("data", (data) => {
      console.log(`[Python Stdout]: ${data.toString()}`);
    });

    backendProcess.stderr.on("data", (data) => {
      // Inyecta el error de Python en tu consola negra de las DevTools que tienes abierta
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.executeJavaScript(`console.error("ERROR DE PYTHON EN PRODUCCIÓN: ${data.toString().replace(/\\/g, '\\\\').replace(/\n/g, ' ')}")`);
      }
    });

    backendProcess.unref();

  } catch (err) {
    console.error("Excepción atrapada en startBackend:", err);
  }
}


function createWindow() {
  if (mainWindow) return;

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Market Pro",
    icon: path.join(__dirname, 'assets', 'market.ico'),
    webPreferences: {
      webSecurity: true,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const indexPath = path.join(app.getAppPath(), "dist", "index.html");

  console.log("INDEX PATH:", indexPath);

  mainWindow.loadFile(indexPath);


  //if (!app.isPackaged) {}
  mainWindow.webContents.openDevTools();


  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startBackend();
  setTimeout(createWindow, 4000);
});

app.on("will-quit", () => {
  if (app.isPackaged) {
    // En Windows empaquetado, usamos taskkill nativo para limpiar el ejecutable sin romper hilos
    try {
      exec("taskkill /F /IM facturation-api.exe /T", (err) => {
        if (err) console.error("Error al limpiar proceso de Python:", err);
      });
    } catch (e) {
      console.error(e);
    }
  } else if (backendProcess) {
    try { backendProcess.kill(); } catch (e) { }
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
