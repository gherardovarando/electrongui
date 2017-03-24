/**
 * @author : gherardo varando (gherardo.varando@gmail.com)
 *
 * @license: GPL v3
 *     This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

const EventEmitter = require('events');
const ProgressBar = require('ProgressBar');
const storage = require('electron-json-storage');
const fs = require('fs');
const {
    Menu,
    MenuItem,
    app
} = require('electron').remote;
const {
    dialog
} = require('electron').remote;

const {
    ipcRenderer
} = require("electron");

const Util = require('Util');
const ToggleElement = require('ToggleElement');
const {
    TreeList,
    TreeListInput
} = require('TreeList');
const ListGroup = require('ListGroup');
const NavGroup = require('NavGroup');
const ButtonsContainer = require('ButtonsContainer');
const Sidebar = require('Sidebar');


let instance = null;
let minHeight = 65;
if (process.platform === 'win32') {
    minHeight = 100;
}


class Header extends ToggleElement {
    constructor(element) {
        super(element);
        this.id = element.id;
        let actionsContainer;
        if (element.getElementsByClassName("toolbar-actions")[0]) {
            actionsContainer = element.getElementsByClassName("toolbar-actions")[0];
        } else {
            actionsContainer = document.createElement("DIV");
            actionsContainer.className = 'toolbar-actions';
            actionsContainer.id = "header-actions";
            this.element.appendChild(actionsContainer);
        }

        this.actionsContainer = new ButtonsContainer(actionsContainer);
    }

    setTitle(title) {
        let tl = this.element.getElementsByClassName('title')[0];
        if (tl) {
            tl.innerHTML = title;
        } else {
            tl = document.createElement('H1');
            tl.className = 'title';
            tl.innerHTML = title;
            let cont = this.element.getElementsByClassName('toolbar-actions')[0];
            if (cont) {
                this.element.insertBefore(tl, cont);
            } else {
                this.element.appendChild(tl);
            }
        }
    }

    addProgressBar() {
        this.progressBar = new ProgressBar(this.element);
    }
}



class Footer extends ToggleElement {
    constructor(element) {
        super(element);
    }
    addNotificationBar() {
        this.notificationBar = new ToggleElement(document.createElement('DIV'));
        this.notificationBar.element.className = 'pull-right';
        this.notificationBar.message = document.createElement('STRONG');
        this.notificationBar.element.appendChild(this.notificationBar.message);
        this.element.appendChild(this.notificationBar.element);
    }

    addProgressBar() {
        this.progressBar = new ProgressBar(this.element);
    }
}



class Gui extends EventEmitter {
    constructor() {
        if (!instance) {
            super(document.getElementsByTagName('BODY')[0]);
            let header = document.getElementsByClassName("toolbar-header")[0];
            header.id = "header";
            this.window = new ToggleElement(document.getElementsByClassName("window-content")[0]);
            this.win = require('electron').remote.getCurrentWindow();
            this.header = new Header(header);
            let footer = document.getElementsByClassName("toolbar-footer")[0];
            footer.id = "footer";
            this.footer = new Footer(footer);
            this.footer.addProgressBar();
            this.footer.addNotificationBar();
            this.subMenus = []
            this.notificationsStack = [];
            //this.menu(); //create the simple menu

            //save always the current workspace
            window.addEventListener('beforeunload', (e) => {
                storage.set('workspace', this.workspace.spaces, (error) => {});
            });

            instance = this;
        }
        return instance;
    }

    bindExtensionManager() {
        const ExtensionsManager = require('ExtensionsManager');
        this.extensionsManager = new ExtensionsManager(this);
        this.extensionsManager.activate();
    }

    bindWorkspace() {
        const Workspace = require('Workspace');
        this.workspace = new Workspace(this);
    }

    viewTrick() {
        let size = this.win.getSize();
        this.win.setSize(size[0] + 1, size[1] + 1);
        this.win.setSize(size[0] - 1, size[1] - 1);
    }


    notify(message) {
        this.footer.notificationBar.message.innerHTML = message;
    }

    setProgress(prog) {
        this.stopWaiting();
        this.footer.progressBar.setBar(prog);
    }

    startWaiting() {
        this.footer.progressBar.startWaiting();
    }

    stopWaiting() {
        this.footer.progressBar.stopWaiting();
    }


    openDevTools() {
        ipcRenderer.send('openDevTools');
    }

    menu() {
        const menu = new Menu();
        const file = new Menu();
        const view = new Menu();
        view.append(new MenuItem({
            label: "Mini",
            type: "normal",
            accelerator: 'F12',
            click: () => {
                this.toggleMini();
            }
        }));
        view.append(new MenuItem({
            label: "Fullscreen",
            type: "normal",
            role: "togglefullscreen"
        }));
        view.append(new MenuItem({
            label: "Toggle DevTools",
            type: "normal",
            role: 'toggledevtools'
        }));
        view.append(new MenuItem({
            label: "Extensions manager",
            type: "normal",
            click: () => {
                this.extensionsManager.show();
            }
        }));
        // view.append(new MenuItem({
        //     label: "Workspace",
        //     type: "normal",
        //     click: () => {
        //         this.workspace.show();
        //     }
        // }));
        file.append(new MenuItem({
            label: "New workspace",
            type: "normal",
            accelerator: 'CmdOrCtrl+Shift+N',
            click: () => {
                if (this.workspace) {
                    this.workspace.newChecking();
                }
            }
        }));
        file.append(new MenuItem({
            label: "Open workspace",
            type: "normal",
            accelerator: 'CmdOrCtrl+Shift+O',
            click: () => {
                if (this.workspace) {
                    this.workspace.loadChecking();
                }
            }
        }));
        file.append(new MenuItem({
            label: "Save workspace",
            type: "normal",
            accelerator: 'CmdOrCtrl+S',
            click: () => {
                if (this.workspace) {
                    this.workspace.save(this.workspace.spaces.workspace.path);
                }
            }
        }));
        file.append(new MenuItem({
            label: "Save workspace as",
            type: "normal",
            accelerator: 'CmdOrCtrl+Shift+S',
            click: () => {
                if (this.workspace) {
                    this.workspace.save();
                }
            }
        }));
        file.append(new MenuItem({
            label: "Load extension",
            type: "normal",
            click: () => {
                if (this.extensionsManager) {
                    dialog.showOpenDialog({
                        title: 'Choose the extesnion file',
                        filter: [{
                            name: 'JavaScript',
                            extensions: ['js', 'JS']
                        }],
                        properties: ['openFile']
                    }, (filePaths) => {
                        if (filePaths) {
                            if (filePaths.length > 0) {
                              this.extensionsManager.loadExtension(filePaths[0]);
                            }
                        }
                    });
                }
            }
        }));
        file.append(new MenuItem({
            label: "Quit",
            type: "normal",
            accelerator: 'CmdOrCtrl+Q',
            click: () => {
                storage.set('workspace', this.workspace.spaces, (error) => {
                    app.quit();
                });
            }
        }));
        menu.append(new MenuItem({
            label: "File",
            type: "submenu",
            submenu: file
        }));
        menu.append(new MenuItem({
            label: "View",
            type: "submenu",
            submenu: view
        }));
        Menu.setApplicationMenu(menu);

    }

    addSubMenu(submenu) {
        let menu = Menu.getApplicationMenu();
        menu.append(submenu);
        this.subMenus.push(submenu);
        Menu.setApplicationMenu(menu);
    }



    removeSubmenu(submenu) {
        let idx = this.subMenus.indexOf(submenu);
        if (idx < 0) return;
        this.menu();
        this.subMenus.splice(idx, 1);
        this.menu();
        let menu = Menu.getApplicationMenu();
        this.subMenus.map((sub) => {
            menu.append(sub);
        });
        Menu.setApplicationMenu(menu);
    }

    minimize() {
        let size = this.win.getSize();
        this.win.setSize(size[0], minHeight, true);
    }

    maximize() {
        let size = this.win.getSize();
        this.win.setSize(size[0], 600, true);
    }


    toggleMini() {
        let size = this.win.getSize();
        if (size[1] <= minHeight) {
            this.maximize();
        } else {
            this.minimize();
        }
    }

}



module.exports = new Gui();
