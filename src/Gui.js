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
const ProgressBar = require('./ProgressBar');
const fs = require('fs');
const {
    Menu,
    MenuItem
} = require('electron').remote;
const ToggleElement = require('./ToggleElement');
const ButtonsContainer = require('./ButtonsContainer');


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
        super();
        let header = document.getElementsByClassName("toolbar-header")[0];
        header.id = "header";
        this.win = require('electron').remote.getCurrentWindow();
        this.window = new ToggleElement(document.getElementsByClassName("window-content")[0]);
        this.header = new Header(header);
        let footer = document.getElementsByClassName("toolbar-footer")[0];
        footer.id = "footer";
        this.footer = new Footer(footer);
        this.footer.addProgressBar();
        this.footer.addNotificationBar();
        this.menuItems = [];
        this.menu = new Menu();
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

    reloadMenu() {
        this.menu = new Menu();
        this.menuItems.map((item) => {
            menu.append(item);
        });
        Menu.setApplicationMenu(menu);
    }

    addMenuItem(item, label) {
        if (item instanceof MenuItem) {
            let menu = Menu.getApplicationMenu();
            menu.append(item);
            this.menuItems.push(item);
            Menu.setApplicationMenu(menu);
        }
    }

    removeMenuItem(item) {
        if (item instanceof MenuItem) {
            let idx = this.menuItems.indexOf(item);
            if (idx < 0) return;
            this.menuItems.splice(idx, 1);
            this.reloadMenu();
        }
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



module.exports = Gui();
