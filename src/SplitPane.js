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

"use strict";

const ToggleElement = require('./ToggleElement');

class SplitPane extends ToggleElement {
    constructor(element) {
        super(element);
        this.element.className = 'pane';
        this.top = document.createElement('DIV');
        this.top.className = 'h-pane-top';
        this.top.style.height = "100%";
        this.element.appendChild(this.top);

        this.bottom = document.createElement('DIV');
        this.bottom.className = 'h-pane-bottom';
        this.bottom.style.height = "0%";
        this.element.appendChild(this.bottom);

    }

    showBottom(x) {
        this.bottom.style.height = `${x||70}%`;
        this.top.style.height = `${(100-x)||30}%`;
    }

    hideBottom() {
        this.top.style.height = "100%";
        this.bottom.style.height = "0%";
    }

    toggleBottom() {
        if (this.bottom.style.height == "0%") {
            this.showBottom();
        } else {
            this.hideBottom();
        }
    }


}


module.exports = SplitPane;
