import {ipcMain, Notification} from 'electron';

export const useNotification = () => {
  const isMac = process.platform === 'darwin';

// 消息处理
  ipcMain.handle('notification', (event, params: NotificationParams) => {
    const sender = event.sender;
    //  默认png
    if (!params.icon) {
      // params.icon = join(__dirname, '..', '..', 'build', 'icons', 'icon.ico');
      params.icon = "../../src/assets/images/logo-small.png";
    }

    if (isMac && params.type === 'message') {
      // 通过通知类型是message则代表是 app发来的消息, 需要回复
      params.hasReply = true;
      params.replyPlaceholder = '请输入';
    }

    const baseType = params.type === 'base' || !params.type

    params.timeoutType = baseType ? 'default' : 'never';

    const notification = new Notification(params);
    notification.show();

    if (baseType) return;

    notification.on('click', () => sender.send('return-notification', params));

    if (!isMac) return;

    notification.on('reply', (_, reply: string) => sender.send('return-notification', {...params, reply}));

  });
}
