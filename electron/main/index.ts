import {app, BrowserWindow, dialog, ipcMain, shell} from 'electron';
import {useNotification} from './notification';
import {getMacAddress} from './getMacAddress';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFileSync} from 'node:fs'
import {release} from 'node:os';
import updator from './updator';


// @ts-ignore
globalThis.__filename = fileURLToPath(import.meta.url)
globalThis.__dirname = dirname(__filename)

process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')

const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

const iconPath = join(process.env.VITE_PUBLIC, 'favicon.ico')

async function createWindow() {
  win = new BrowserWindow({
    title: '元阿网络',
    icon: iconPath,
    width: 1200,
    height: 800,
    webPreferences: {
      // contextIsolation: true,
      preload,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }


  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({url}) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return {action: 'deny'}
  });

  ipcMain.handle('icon-path', () => iconPath);
}

app.whenReady().then(createWindow).then(() => updator(win));

// app.on('window-all-closed', () => {
//   win = null
//   if (process.platform !== 'darwin') app.quit()
// })

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, {hash: arg})
  }
});

ipcMain.handle('open-url', (_, url) => shell.openExternal(url));

async function handleFileOpen(_, params: OpenFileParams) {

  const typeMap: Record<'img' | 'sheet' | 'all', () => any> = {
    'img': () => {
      const imgTypes = ['bmp', 'jpg', 'png', 'tif', 'gif', 'pcx', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr', 'pcd', 'dxf', 'ufo', 'eps', 'ai', 'raw', 'WMF', 'webp', 'avif', 'apng'];
      return [
        {name: 'Images', extensions: [...imgTypes, ...imgTypes.map(type => type.toUpperCase())]}
      ]
    },
    'sheet': () => {
      return [
        {name: 'Custom File Type', extensions: ['xlsx']},
      ]
    },
    'all': () => {
      return {name: 'All Files', extensions: ['*']}
    }
  }

  const filters = typeMap[params?.type || 'all']();

  const {canceled, filePaths} = await dialog.showOpenDialog(win, {
    title: params?.title || '选择文件',
    filters
  })
  if (!canceled) {
    const path = filePaths[0];

    const buffer = readFileSync(path);

    return {path, data: buffer};
  }
  return {path: '', data: null}
}

ipcMain.handle('dialog:openFile', handleFileOpen)

ipcMain.handle('ready', (event) => {
  const sender = event.sender;
  const address = getMacAddress();
  sender.send('mac-address', {macAddress: address, platform: process.platform});
});



useNotification();

