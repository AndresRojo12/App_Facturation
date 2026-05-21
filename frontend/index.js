const { app, BrowserWindow } = require("electron");
const path = require("path");
const { pathToFileURL } = require("url");
const { spawn } = require("child_process");
const fs = require("fs");

let backendProcess;

function startBackend() {
const isPackaged = app.isPackaged;

const binaryName =
process.platform === "win32"
? "facturation-api.exe"
: "facturation-api";

let backendPath;

// PRODUCCIÓN
if (isPackaged) {
backendPath = path.join(process.resourcesPath, binaryName);


// Linux necesita permisos de ejecución
if (process.platform !== "win32") {
  if (fs.existsSync(backendPath)) {
    try {
      fs.chmodSync(backendPath, "755");
    } catch (err) {
      console.error("Error chmod:", err);
    }
  }
}


}

// DESARROLLO
else {
backendPath = path.join(
__dirname,
"..",
"facturation",
"dist",
binaryName
);
}

console.log("Iniciando backend en:", backendPath);

if (!fs.existsSync(backendPath)) {
console.error("No existe el backend:", backendPath);
return;
}

const customEnv = {
...process.env,
ENV: isPackaged ? "production" : "development",
USER_DATA_PATH: app.getPath("userData"),
};

backendProcess = spawn(backendPath, [], {
env: customEnv,

cwd: isPackaged
  ? process.resourcesPath
  : path.join(__dirname, "..", "facturation"),

shell: false,
detached: false,


});

backendProcess.stdout.on("data", (data) => {
console.log(`Backend: ${data}`);
});

backendProcess.stderr.on("data", (data) => {
console.error(`Backend Error: ${data}`);
});

backendProcess.on("close", (code) => {
console.log(`Backend cerrado con código: ${code}`);
});
}

function createWindow() {
const win = new BrowserWindow({
width: 1200,
height: 800,


title: "Market Pro",

icon: path.join(__dirname, "assets", "icon.png"),

webPreferences: {
  contextIsolation: true,
  nodeIntegration: false,
},


});

const indexPath = path.join(__dirname, "dist", "index.html");

setTimeout(() => {
win.loadURL(pathToFileURL(indexPath).href);


// SOLO EN DESARROLLO
if (!app.isPackaged) {
  win.webContents.openDevTools();
}


}, 1500);
}

app.whenReady().then(() => {
startBackend();

createWindow();
});

app.on("will-quit", () => {
if (backendProcess) {
backendProcess.kill();
}
});

app.on("window-all-closed", () => {
if (process.platform !== "darwin") {
app.quit();
}
});
