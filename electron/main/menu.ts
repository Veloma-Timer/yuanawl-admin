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
        {
          label: '退出',
          role: 'quit'
        }
      ]
    },
    {
      label: '窗口',
      submenu: [
        {
          label: '检查更新',
          click: () => updator(),
        },
        {label: '刷新', role: 'reload'},
        {label: '强制刷新', role: 'forceReload'},
        {label: '打开调试窗口', role: 'toggleDevTools'},
      ]
    }
  ]);

  Menu.setApplicationMenu(menu)
}
