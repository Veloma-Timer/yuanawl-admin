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
          label: '检查更新',
          click: () => {
            updator();
          },
        },
        {
          label: '退出',
          role: 'quit'
        }
      ]
    }
  ]);

  Menu.setApplicationMenu(menu)
}
