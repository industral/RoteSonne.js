'use strict';

const electron = require('electron');
const app = electron.app;
const dialog = require('dialog');
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

var mainWindow = null;
var forceQuit = false;

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', function() {
  mainWindow = null;
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 500,
    minHeight: 200,
    acceptFirstMouse: true,
    titleBarStyle: 'hidden'
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('close', function(e) {
    if (!forceQuit) {
      e.preventDefault();

      mainWindow.hide();
    }
  });

  app.on('before-quit', function(e) {
    app.exit(0);
  });

  app.on('activate', function() {
    mainWindow.show();
  });

  var template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open library',
          accelerator: 'CmdOrCtrl+O',
          click: function() {

            dialog.showOpenDialog({
              properties: ['openDirectory']
            }, function(files) {
              if (files) {
                mainWindow.webContents.send('library-selected', files);
              }
            });

          }
        }
      ]
    },
    {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }
      ]
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: function() {
            require('electron').shell.openExternal('http://rotesonne.org')
          }
        }
      ]
    }
  ];

  if (process.env.DEBUG) {
    template.unshift({
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: function(item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.reload();
            }
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: (function() {
            if (process.platform == 'darwin') {
              return 'Ctrl+Command+F';
            } else {
              return 'F11';
            }
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
            }
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: (function() {
            if (process.platform == 'darwin') {
              return 'Alt+Command+I';
            } else {
              return 'Ctrl+Shift+I';
            }
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.toggleDevTools();
            }
          }
        }
      ]
    });
  }

  if (process.platform == 'darwin') {
    template.unshift({
      label: 'RoteSonne.js',
      submenu: [
        {
          label: 'About RoteSonne.js',
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide RoteSonne.js',
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Alt+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() {
            forceQuit = true;
            app.quit();
          }
        }
      ]
    });
    // Window menu.
    template[3].submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      }
    );
  }

  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});
