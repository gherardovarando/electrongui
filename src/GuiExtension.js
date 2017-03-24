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

const ToggleElement = require('./ToggleElement.js');
const util = require('./util.js');
const {
    Menu,
    MenuItem
} = require('electron').remote;
let gui = require('./gui.js');

class GuiExtension extends ToggleElement {
    constructor(config) {
        let element = document.createElement('DIV');
        element.className = 'pane-group';
        element.style.display = 'none'; //hide by default
        super(element);
        this.element.id = `${this.constructor.name}Pane`;
        this.id = this.constructor.name;
        this.icon = config.icon || 'fa fa-cubes';
        gui.container.appendChild(this.element);
        this._menuItems = [];
        this._menuIndx = -1;
        this._menu = new Menu();
        if (config.menuTemplate){
          this._menu =  Menu.buildFromTemplate(config.menuTemplate);
        }
        this._menuLabel = config.menuLabel  || 'Extension';
        this._menuItem = new MenuItem({
            label: this._menuLabel,
            type: 'submenu',
            submenu: this._menu
        });
        gui.emit('load:extension', {
            extension: this
        });
    }

    activate() {
        this.active = true;
        this.emit('activate');
        return this.active;
    }

    deactivate() {
        this.hide();
        this.clear();
        this.removeMenu();
        this.active = false;
        this.emit('deactivate');
        return this.active;
    }

    _buildMenuItem() {
        this._menu = new Menu();
        this._menuItems.map((item) => {
            this._menu.append(item);
        });
        this._menuItem = new MenuItem({
            label: this._menuLabel,
            type: 'submenu',
            submenu: this._menu
        });
    }

    setMenuLabel(label) {
        if (typeof label === 'string') {
            this._menuLabel = label;
        }
    }


    addMenuItem(item) {
        if (item) {
            this._menuItems.push(item);
            this._buildMenuItem();
            gui.updateMenuItem(this._menuIndx, this._menuItem);
        }
    }

    removeMenuItem(item) {
        this._removeMenu(); //remove before it changes
        if (item) {
            let idx = this._menuItems.indexOf(item);
            if (idx < 0) return;
            this._menuItems.splice(idx, 1);
            this._buildMenuItem();
            gui.updateMenuItem(this._menuIndx, this._menuItem);
        }
    }

    appendMenu() {
        if (this._menuIndx >= 0) return false;
        this._buildMenuItem();
        this._menuIndx = gui.addMenuItem(this._menuItem);
        return true;
    }

    removeMenu() {
        gui.removeMenuItem(this._menuIndx);
        this._menuIndx = -1;
    }

    show() {
        super.show();
        this.emit('show');
    }

    hide() {
        super.hide();
        this.emit('hide');
    }
}

module.exports = GuiExtension;
