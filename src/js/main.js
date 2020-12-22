const DEV = false;

const { app, dialog, Menu } = require("electron");
const { BrowserWindow } = require("electron");
const path = require("path");
const { ipcMain } = require("electron");
let controlsWindow, floatingWindow, howToWindow, aboutWindow;
let windowNumbering = [true, true, true, true, true, true, true, true, true];

const createControlsWindow = () => {
  controlsWindow = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: false,
    frame: true,
    resizable: false,
    
    webPreferences: {
      preload: path.join(__dirname, "preload-remote.js"),
      enableRemoteModule: true,
    },
    alwaysOnTop: false,
  });

  controlsWindow.loadFile(path.join(__dirname, "../html/controls.html"));

  if (DEV) controlsWindow.webContents.openDevTools();
}

const createHelpWindow = () => {
  helpWindow = new BrowserWindow({
    width: 800,
    height: 800,
    transparent: false,
    frame: true,
    resizable: false,
    webPreferences: {
    },
    alwaysOnTop: false,
  });
  helpWindow.loadFile(path.join(__dirname, "../html/help.html"));
  if (DEV) helpWindow.webContents.openDevTools();
}

const createAboutWindow = () => {
  aboutWindow = new BrowserWindow({
    width: 700,
    height: 500,
    transparent: false,
    titleBarStyle: "hidden",
    resizable: false,
    webPreferences: {
    },
    alwaysOnTop: false,
  });

  aboutWindow.loadFile(path.join(__dirname, "../html/about.html"));
  if (DEV) aboutWindow.webContents.openDevTools();
}

const createHowToWindow = () => {
  howToWindow = new BrowserWindow({
    width: 600,
    height: 500,
    transparent: false,
    frame: true,
    resizable: false,
    webPreferences: {
    },
    alwaysOnTop: false,
  });
  howToWindow.loadFile(path.join(__dirname, "../html/howto/index.html"));
  if (DEV) howToWindow.webContents.openDevTools();
}

const createFloatingWindow = (width, height) => {
  const w = Math.ceil(width);
  const h = Math.ceil(height);
  if (windowNumbering.every((e) => !e)) {
    dialog.showMessageBox({
      title: "Enough heads",
      message: "Only 9 floating heads allowed 😄",
    });
    return;
  }
  const index = windowNumbering.findIndex((e) => e);
  windowNumbering[index] = false;
  console.log(index);
  console.log("Creating a window with", w, h);
  floatingWindow = new BrowserWindow({
    title: "Floating Head " + (index + 1),
    width: w + 2,
    height: h + 2,
    maxWidth: w+4,
    maxHeight: h+4,
    fullscreenable: false,
    center: true,
    transparent: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    alwaysOnTop: true,
  });
  floatingWindow.on("close", () => {
    windowNumbering[index] = true;
  });
  floatingWindow.loadFile(path.join(__dirname, "../html/floating.html"));
  if (DEV) floatingWindow.webContents.openDevTools();
}

ipcMain.on("video-arguments", (event, arg) => {
  createFloatingWindow(arg.width, arg.height);
  console.log(arg);
  floatingWindow.webContents.once("dom-ready", () => {
    floatingWindow.webContents.send("video-arguments", arg);
  });
});

const isMac = process.platform === "darwin";

const template = [
  {
          label: app.name,
          submenu: [
            { label: "About Guillotine", click: createAboutWindow },
            { role: "help", click: createHelpWindow},
            { type: "separator" },
            { label: "How to", click: createHowToWindow},
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideothers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : []),
      { label: "Close", accelerator: "CmdOrCtrl+W", role: "close" },
    ],
  }
];

const windowMenu = template.find((item) => item.label === "Window");
windowMenu.role = "window";

let applicationMenu = Menu.buildFromTemplate(template);

app.on("ready", () => {
  Menu.setApplicationMenu(applicationMenu);
  createControlsWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
