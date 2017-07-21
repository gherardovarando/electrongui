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
    constructor(parent, options) {
        options = Object.assign({
            className: ''
        }, options);
        if (parent.appendChild) {
            let element = util.div(`sidebar ${options.className}`);
            element.id = `${parent.id}Sidebar${parent.getElementsByClassName('sidebar').length}`;
            super(element);
            this.parent = parent;
            this.hide();
            parent.appendChild(element);
        }

    }

    addList() {
        switch (typeof arguments[0]) {
            case 'string':
                let id = arguments[0];
                if (id === 'nav' || id === 'element' || id === 'parent') return;
                let list = new ListGroup(id || `${this.element.id}list`, this.element);
                this[id || 'list'] = list;
                this.appendChild(list);
                break;
            case 'object':
                if (arguments[0] instanceof ListGroup) {
                    this[arguments[0].id] = arguments[0];
                    this.appendChild(arguments[0]);
                } else {
                    this['list'] = new ListGroup('list', this.element);
                    this.appendChild(this['list']);
                }
            default:
                this['list'] = new ListGroup('list', this.element);
                this.appendChild(this['list']);
        }
    }

    addNav() {
        switch (typeof arguments[0]) {
            case 'string':
                let id = arguments[0];
                if (id === 'list' || id === 'element' || id === 'parent') return;
                let nav = new NavGroup(id || `${this.element.id}nav`, this.element);
                this[id || 'nav'] = nav;
                this.appendChild(nav);
                break;
            case 'object':
                if (arguments[0] instanceof NavGroup) {
                    this[arguments[0].id] = arguments[0];
                    this.appendChild(arguments[0]);
                } else {
                    this['nav'] = new NavGroup(`nav`, this.element);
                    this.appendChild(this['nav']);

                }
            default:
                this['nav'] = new NavGroup(`nav`, this.element);
                this.appendChild(this['nav']);
        }
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
