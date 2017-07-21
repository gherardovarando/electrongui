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
const util = require('./util');

class ToggleElement extends EventEmitter {
    constructor(element) {
        super();
        if (!element) {
            element = util.div();
        }
        this.element = element;
        this.id = element.id;
    }

    appendTo(par) {
        if (!this.element) return;
        if (!par) return;
        if (typeof par.appendChild === 'function') {
            par.appendChild(this.element);
            this.parent = par;
        }
    }

    appendChild(el) {
        if (this.element) {
            if (el.element) {
                this.element.appendChild(el.element);
            } else if (el.appendChild) {
                this.element.appendChild(el);
            }
        }
    }

    removeChild(el) {
        if (this.element) {
            if (el.element) {
                this.element.removeChild(el.element);
            } else if (el.appendChild) {
                this.element.removeChild(el);
            }
        }
    }


    clear() {
        util.empty(this.element, this.element.firstChild);
    }

    show() {
        this.element.style.display = "";
        this.emit('show');
    }

    hide() {
        this.element.style.display = "none";
        this.emit('hide');
    }


    toggle() {
        if (this.element.style.display === 'none') {
            this.show();
        } else {
            this.hide();
        }
    }

    isHidden() {
        return this.element.style.display === 'none';
    }

    addToggleButton(options) {
        let opt;
        if (options.buttonsContainer) {
            opt = {
                text: options.text,
                id: options.id || this.id,
                icon: options.icon,
                toggle: false,
                className: options.className,
                groupId: options.groupId,
                groupClassName: options.groupClassName,
                action: () => {
                    if (options.action) {
                        options.action();
                    }
                    this.toggle();

                }
            };
            options.buttonsContainer.addButton(opt);
            this.buttonsContainer = options.buttonsContainer;

            this.on('show', (e) => {
                if (this.buttonsContainer.buttons[opt.id]) {
                    this.buttonsContainer.buttons[opt.id].classList.add('active');
                }
            });

            this.on('hide', (e) => {
                if (this.buttonsContainer.buttons[opt.id]) {
                    this.buttonsContainer.buttons[opt.id].classList.remove('active');
                }
            });
        }


    }
    removeToggleButton(id) {
        this.buttonsContainer.removeButton(id || this.id);
    }
}

module.exports = ToggleElement;
