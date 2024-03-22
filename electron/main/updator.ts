import {autoUpdater} from 'electron-updater';
import {app, BrowserWindow, dialog} from 'electron';

const COMMON_ERROR_LOG = 'common-error-log';

export default (mainWindow: BrowserWindow) => {
  const sendStatusToWindow = (text) => {
    mainWindow.webContents.send(COMMON_ERROR_LOG, `update msg:${text}`);
  }
  autoUpdater.checkForUpdates();
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('checking-for-update', () => {
    dialog
      .showMessageBox({
        type: 'info',
        title: '提示',
        message: `检查更新中....`,
      });
    sendStatusToWindow('Checking for update...');
  });

  autoUpdater.on('update-available', (info) => {
    // 当有新版本可用时，弹窗提示用户
    dialog
      .showMessageBox({
        type: 'info',
        title: '新版本可用',
        message: '有一个可用的新版本，要更新吗',
        buttons: ['是', '否']
      })
      .then((result) => {
        if (result.response === 0) {
          // 用户选择更新，触发下载和安装
          autoUpdater.downloadUpdate();
        }
      });
  });

  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.')
  });

  autoUpdater.on('error', (err) => {
    dialog
      .showMessageBox({
        type: 'info',
        title: '提示',
        message: `更新失败请联系开发人员: ${JSON.stringify(err, null, 2)}`
      });
    sendStatusToWindow(err);
  });

  autoUpdater.on('update-downloaded', () => {
    // 处理下载完成的情况
    dialog
      .showMessageBox({
        type: 'info',
        title: '更新下载完成',
        message: '点击确定重启获取最新内容',
        buttons: ['确定']
      })
      .then(() => {
        // 调用 quitAndInstall 来安装更新
        autoUpdater.quitAndInstall();
      });
  });
  autoUpdater.on('download-progress', (progressObj) => {
    sendStatusToWindow(JSON.stringify(progressObj));
  });
}
