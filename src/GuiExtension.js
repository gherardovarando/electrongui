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

const ToggleElement = require('ToggleElement');
let gui = require('Gui');

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
    }

    activate() {
        this.active = true;
        this.emit('activate');
        return this.active;
    }

    deactivate() {
        this.hide();
        this.active = false;
        try {
            let pane = this.element;
            Util.empty(pane, pane.firstChild);
        } catch (e) {
            console.log();
        }
        this.emit('deactivate');
        return this.active;
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
