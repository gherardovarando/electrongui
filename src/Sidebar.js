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
const ListGroup = require('./ListGroup.js');
const NavGroup = require('./NavGroup.js');
const util = require('./util.js');

class Sidebar extends ToggleElement {
    constructor(parent) {
        if (parent.appendChild) {
            let element = util.div(null,"pane-sm sidebar animated scrollable fixwidth");
            element.id = `${parent.id}Sidebar${parent.getElementsByClassName('sidebar').length}`;
            super(element);
            this.parent = parent;
            this.hide();
            parent.appendChild(element);
        }

    }

    addList(id) {
        if (id === 'nav' || id === 'element' || id === 'parent') return;
        this[id || 'list'] = new ListGroup(this.element);

    }

    addNav(id) {
        if (id === 'list' || id === 'element' || id === 'parent') return;
        this[id || 'nav'] = new NavGroup(this.element);
    }



    addItem(options) {
        if (this.list) {
            this.list.addItem(options);
        } else if (this.nav) {
            this.nav.addItem(options);
        } else {
            this.addList();
            this.addItem(options);
        }
    }

    remove() {
        this.parent.removeChild(this.element);
    }

}


module.exports = Sidebar;
