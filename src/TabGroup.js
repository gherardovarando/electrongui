/**
 * @author : Mario Juez (mjuez@fi.upm.es)
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
const ToggleElement = require('./ToggleElement.js');

class TabGroup extends ToggleElement {

    constructor(parent) {
        if (parent.appendChild && (typeof parent.id === 'string')) {
            let element = util.div(null, `tab-group`);
            super(element);
            this.tabItems = {};
            this.appendTo(parent);
        }
    }

    addItem(config) {
        let cssclass = `tab-item`;
        if(Object.keys(this.tabItems).length === 0){
            cssclass = `${cssclass} active`;
        }

        let tabItem = util.div(config.name, cssclass);
        tabItem.addEventListener('click', () => {
            if (!tabItem.classList.contains(`active`)) {
                Object.keys(this.tabItems).map((key) => {
                    if (this.tabItems[key].classList.contains(`active`)) {
                        this.tabItems[key].classList.remove(`active`);
                    }
                });

                tabItem.classList.add(`active`);
            }
        });
        this.tabItems[config.id] = tabItem;
        this.element.appendChild(tabItem);
    }

    addClickListener(id, listener) {
        let tabItem = this.tabItems[id];
        tabItem.addEventListener('click', listener);
    }

}

module.exports = TabGroup;
