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

const Util = require('Util');
const ToggleElement = require('ToggleElement');

class NavGroup extends ToggleElement {
    constructor(parent) {
        if (parent.appendChild && (typeof parent.id === 'string')) {
            //if (document.getElementById(`${parent.id}Nav`)) return;
            let element = document.createElement('NAV');
            element.className = 'nav-group';
            element.id = `${parent.id}Nav`;
            super(element);
            this.id = `${parent.id}Nav`;
            this.items = {};
            this.nItems = 0;
            this.title = " ";
            let h5 = document.createElement("H5");
            h5.className = "nav-group-title";
            h5.innerHTML = this.title;
            this.element.appendChild(h5);
            this.appendTo(parent)
        }
    }



    addItem(options) {
        let span = document.createElement('A');
        span.className = 'nav-group-item';
        options.id = options.id || `${this.nItems}`;
        span.id = `${this.id}Item${options.id}`;

        if (typeof options.title === 'string') {
            span.innerHTML = options.title;
        } else {
            span.appendChild(options.title);
        }


        if (typeof options.icon === "string") {
            span.appendChild(Util.icon(options.icon));
        } else if (typeof options.image === "string") {
            let img = document.createElement('IMG');
            img.className = 'img-circle media-object pull-left icon';
            img.src = options.image;
            img.width = '25';
            img.height = '25';
            span.appendChild(img);
        }

        if (options.toggle) {
            span.onclick = (arg) => {
                let done = false;
                let b = span;
                if (options.toggle.justOne) {
                    this.applyAll((it) => {
                        it.classList.remove('active');
                    });
                }
                if (b.className.includes('active')) {

                    b.classList.remove('active');
                    if (typeof options.onclick.deactive === 'function') {
                        options.onclick.deactive();
                        done = true;
                    }
                } else {
                    b.className = `nav-group-item active`;
                    if (typeof options.onclick.active === 'function') {
                        options.onclick.active();
                        done = true;
                    }
                }
                if (!done) {
                    if (typeof options.onclick === 'function') {
                        options.onclick();
                    }
                }


            }
        } else {
            span.onclick = options.onclick;
        }

        this.items[options.id] = span;
        this.element.appendChild(span);
        this.nItems++;
    }


    clean() {
        for (let it in this.items) {
            delete this.items[it];
        }
        Util.empty(this.element, this.element.firstChild);
    }

    applyAll(f) {
        for (let it in this.items) {
            if (f) {
                f(this.items[it]);
            }
        }
    }

    removeItem(id) {
        if (id === undefined || id === null) {
            return;
        }
        let item = this.items[id];
        this.element.removeChild(item);
        delete this.items.item;
        this.nItems--;

    }

    addTitle(title) {
        if (typeof title === 'string') {
            let h5 = document.createElement('H5');
            h5.className = 'nav-group-title';
            h5.innerHTML = title;
            this.element.appendChild(h5);
        }
    }

    removeTitle(title) {
        let h5s = this.element.getElementsByClassName('nav-group-title');
        h5s.map((h5) => {
            if (h5s.innerHTML === title) {
                this.element.removeChild(h5);
            }
        });
    }


}

module.exports = NavGroup;
