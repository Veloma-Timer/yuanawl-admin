"use strict";
const electron = require("electron");
const node_os = require("node:os");
const node_path = require("node:path");
const node_url = require("node:url");
var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
const useNotification = () => {
  const isMac = process.platform === "darwin";
  electron.ipcMain.handle("notification", (event, params) => {
    const sender = event.sender;
    if (!params.icon) {
      params.icon = "../../src/assets/images/logo-small.png";
    }
    if (isMac && params.type === "message") {
      params.hasReply = true;
      params.replyPlaceholder = "请输入";
    }
    const baseType = params.type === "base" || !params.type;
    params.timeoutType = baseType ? "default" : "never";
    const notification = new electron.Notification(params);
    notification.show();
    if (baseType)
      return;
    notification.on("click", () => sender.send("return-notification", params));
    if (!isMac)
      return;
    notification.on("reply", (_, reply) => sender.send("return-notification", { ...params, reply }));
  });
};
const zeroRegex = /(?:[0]{1,2}[:-]){5}[0]{1,2}/;
function getMacAddress(iface) {
  const list = node_os.networkInterfaces();
  if (iface) {
    const parts = list[iface];
    if (!parts) {
      throw new Error(`interface ${iface} was not found`);
    }
    for (const part of parts) {
      if (zeroRegex.test(part.mac) === false) {
        return part.mac;
      }
    }
    throw new Error(`interface ${iface} had no valid mac addresses`);
  } else {
    for (const [key, parts] of Object.entries(list)) {
      if (!parts)
        continue;
      for (const part of parts) {
        if (zeroRegex.test(part.mac) === false) {
          return part.mac;
        }
      }
    }
  }
  throw new Error("failed to get the MAC address");
}
globalThis.__filename = node_url.fileURLToPath(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.src || new URL("index.js", document.baseURI).href);
globalThis.__dirname = node_path.dirname(__filename);
process.env.DIST_ELECTRON = node_path.join(__dirname, "..");
process.env.DIST = node_path.join(process.env.DIST_ELECTRON, "../dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL ? node_path.join(process.env.DIST_ELECTRON, "../public") : process.env.DIST;
if (node_os.release().startsWith("6.1"))
  electron.app.disableHardwareAcceleration();
if (process.platform === "win32")
  electron.app.setAppUserModelId(electron.app.getName());
if (!electron.app.requestSingleInstanceLock()) {
  electron.app.quit();
  process.exit(0);
}
let win = null;
const preload = node_path.join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = node_path.join(process.env.DIST, "index.html");
async function createWindow() {
  win = new electron.BrowserWindow({
    title: "Main window",
    icon: node_path.join(process.env.VITE_PUBLIC, "favicon.ico"),
    width: 1200,
    height: 800,
    webPreferences: {
      preload
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(url);
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.setWindowOpenHandler(({ url: url2 }) => {
    if (url2.startsWith("https:"))
      electron.shell.openExternal(url2);
    return { action: "deny" };
  });
}
electron.app.whenReady().then(createWindow);
electron.app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin")
    electron.app.quit();
});
electron.app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized())
      win.restore();
    win.focus();
  }
});
electron.app.on("activate", () => {
  const allWindows = electron.BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
electron.ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new electron.BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
electron.ipcMain.handle("open-url", (_, url2) => electron.shell.openExternal(url2));
electron.ipcMain.handle("ready", (event) => {
  const sender = event.sender;
  const address = getMacAddress();
  console.log("发送");
  sender.send("mac-address", address);
});
useNotification();
//# sourceMappingURL=index.js.map
