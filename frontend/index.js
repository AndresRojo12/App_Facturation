const { app, BrowserWindow } = require("electron");
const path = require("path");
const { pathToFileURL } = require("url");
const { spawn } = require("child_process");

let backendProcess;

function startBackend() {
  const isPackaged = app.isPackaged;
  let backendPath;

  if (isPackaged) {
    const binaryName =
      process.platform === "win32" ? "facturation-api.exe" : "facturation-api";
    backendPath = path.join(process.resourcesPath, binaryName);

    // Habilitar permisos de ejecución en Linux
    if (process.platform !== "win32") {
      const fs = require("fs");
      if (fs.existsSync(backendPath)) {
        try {
          fs.chmodSync(backendPath, "755");
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      // Desarrollo: apunta al binario generado en tu monorrepo
      const binaryName =
        process.platform === "win32"
          ? "facturation-api.exe"
          : "facturation-api";
      backendPath = path.join(
        __dirname,
        "..",
        "facturation",
        "dist",
        binaryName,
      );
    }

    console.log("Iniciando backend en:", backendPath);

    // Forzar las variables de entorno para el subproceso de Python
    const customEnv = {
      ...process.env,
      ENV: isPackaged ? "production" : "development",
      USER_DATA_PATH: app.getPath("userData"), // Pasa la ruta segura de Electron (App Data)
    };

    backendProcess = spawn(backendPath, [], {
      env: customEnv,
      // PASO CLAVE: Ejecutar desde 'resources' en producción para que encuentre el archivo .env.production
      cwd: isPackaged
        ? process.resourcesPath
        : path.join(__dirname, "..", "facturation"),
    });

    backendProcess.stdout.on("data", (data) => {
      console.log(`Backend: ${data}`);
    });

    backendProcess.stderr.on("data", (data) => {
      console.error(`Backend Error: ${data}`);
    });
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  const indexPath = path.join(__dirname, "dist", "index.html");

  setTimeout(() => {
    win.loadURL(pathToFileURL(indexPath).href);
    win.webContents.openDevTools();
  }, 1000);

  win.loadURL(pathToFileURL(indexPath).href);

  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  startBackend();

  createWindow();
});

app.on("will-quit", () => {
  if (backendProcess) {
    backendProcess.kill();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});
