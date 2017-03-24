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

const util = require('./util.js');
const ToggleElement = require('./ToggleElement');

class ButtonsContainer extends ToggleElement {
    constructor(element) {
        super(element)
        if (!(typeof this.element.id === 'string')) this.element.id = "ButtonsContainer";
        this.id = this.element.id;
        this.buttons = {};
        this.buttonGroups = {};
        this.nButtons = 0;
        this.nButtonGroups = 0;
    }


    // options = {id, className, text, icon, groupId, toggle, action }
    addButton(options) {
        if (!options) return null;
        if (!(typeof options.className === 'string')) options.className = 'btn-default';
        if (!(typeof options.id === 'string')) options.id = `${this.nButtons}`;
        let btn = document.createElement('BUTTON');
        btn.id = `${this.id}Button${options.id}`; //so the id is not the DOM id
        btn.className = `btn ${options.className}`;
        btn.role = "button";
        if (typeof options.text === 'string') {
            btn.innerHTML = options.text;
        }

        if (options.icon) {
            btn.appendChild(util.icon(options.icon));
        }

        if (options.toggle) {
            btn.onclick = (arg) => {
                let done = false;
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    if (typeof options.action.deactive === 'function') {
                        options.action.deactive(btn);
                        done = true;
                    }
                } else {
                    btn.classList.add('active');
                    if (typeof options.action.active === 'function') {
                        options.action.active(btn);
                        done = true;
                    }
                }
                if (!done && options.action) {
                    options.action(btn);
                }

            }
        } else {
            btn.onclick = options.action;
        }


        if (typeof options.groupId === 'string') {
            if (this.buttonGroups[options.groupId]) {
                this.buttonGroups[options.groupId].appendChild(btn);
            } else {
                this.addButtonGroup({
                    id: options.groupId,
                    className: options.groupClassName || ``
                });
                this.buttonGroups[options.groupId].appendChild(btn);
            }
        } else {
            this.element.appendChild(btn);
        }

        this.buttons[options.id] = btn;
        this.nButtons++;

    }

    removeButton(id, force) {
        if (typeof id === 'string') {
            if (this.buttons[id]) {
                let btn = this.buttons[id];
                if (btn) {
                    btn.parentNode.removeChild(btn);
                } else if (force) {
                    btn = document.getElementById(id);
                    if (btn) {
                        btn.parentNode.removeChild(btn);
                    }
                }
                delete this.buttons[id];
            }
        }
    }

    modifyButton(id, options) {
        //will implement
    }

    addButtonGroup(options, buttons) {
        options = options || {};
        options.className = options.className || '';
        if (!(typeof options.id === 'string')) options.id = `${this.nButtonGroups++}`;
        let grp = util.div(`btn-group ${options.className}`);
        grp.id = `${this.id}ButtonGroup${options.id}`;
        this.buttonGroups[options.id] = grp;
        if (buttons instanceof Array) {
            buttons.map((btn) => {
                btn.groupId = options.id;
                this.addButton(btn);
            });
        }
        this.element.appendChild(grp);
    }

    removeButtonGroup(id, force) {
        if (typeof id === string) {
            if (this.buttonGroups[id]) {
                let btng = document.getElementById(`${this.id}ButtonGroup${id}`);
                if (btng) {
                    btng.parentNode.removeChild(btng);
                } else if (force) {
                    btng = document.getElementById(id);
                    if (btng) {
                        btng.parentNode.removeChild(btng);
                    }
                }
                delete this.buttonGroups[id];
            }
        }
    }



}

module.exports = ButtonsContainer;
