import {app, Menu} from 'electron';

export const useMenu = (updator: Function) => {
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          label: '关于',
          role: 'about'
        },
        {type: 'separator'},
        {
          label: '检查更新',
          click: () => updator(),
        },
        {type: 'separator'},
        {
          label: '退出',
          role: 'quit'
        }
      ]
    },
    {
      label: '窗口',
      submenu: [
        {label: '刷新', role: 'reload'},
        {type: 'separator'},
        {label: '强制刷新', role: 'forceReload'},
        {type: 'separator'},
        {label: '打开调试窗口', role: 'toggleDevTools'},
      ]
    }
  ]);

  Menu.setApplicationMenu(menu)
}
