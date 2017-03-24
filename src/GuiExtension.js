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

const ToggleElement = require('./ToggleElement');
const {
    Menu,
    MenuItem
} = require('electron').remote;
let gui = require('./gui.js');

class GuiExtension extends ToggleElement {
    constructor() {
        let element = document.createElement('DIV');
        element.className = 'pane-group';
        element.style.display = 'none'; //hide by default
        super(element);
        this.element.id = `${this.constructor.name}Pane`;
        this.id = this.constructor.name;
        this.icon = 'fa fa-cubes fa-2x';
        gui.window.element.appendChild(this.element);
        this._menuItems = [];
        this._menu = new Menu();
        this._menuLabel = 'Extension';
        this._menuItem = new MenuItem({
            label: this._menuLabel,
            type: 'submenu',
            submenu: this._menu
        });
    }

    activate() {
        this.active = true;
        this.emit('activate');
        return this.active;
    }

    deactivate() {
        this.hide();
        this.removeMenu();
        this.active = false;
        try {
            let pane = this.element;
            util.empty(pane, pane.firstChild);
        } catch (e) {}
        this.emit('deactivate');
        return this.active;
    }

    _reloadMenu() {
        this._menu = new Menu();
        this._menuItems.map((item) => {
            this._menu.append(item);
        });
        this._menuItems = new MenuItem({
            label: this._menuLabel,
            type: 'submenu',
            submenu: this._menu
        })
    }

    setMenuLabel(label) {
        if (typeof label === 'string') {
            this._menuLabel = label;
        }
    }


    addMenuItem(item) {
        if (item instanceof MenuItem) {
            this._menuItems.push(item);
            this._reloadMenu();
        }
    }

    appendMenu() {
        gui.addMenuItem(this._menuItem);
    }

    removeMenu() {
        gui.removeMenuItem(this._menuItem);
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
