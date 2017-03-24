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


// ProgressBar <- Bar (ToggleElement)
class ProgressBar extends ToggleElement {
    constructor(parent) {
        let element = document.createElement('DIV');
        element.className = 'progress-bar-container';
        parent.appendChild(element);
        super(element);
        this.parent = parent;
        this.value = 0;
        this.bar = new ToggleElement(document.createElement('DIV'));
        this.bar.element.className = 'progress-bar';
        this.element.appendChild(this.bar.element);
    }


    setHeight(h){
      this.element.style.height = `${h}px`;
      this.bar.element.style.height = `${h}px`;
    }

    // value  in  [0,100]
    setBar(value) {
        if (isNaN(value)) return;
        this.value = value;
        this.bar.element.style.width = `${value}%`;
        this.element.title = `${parseInt(value)}%`;
        this.showBar();
    }

    startWaiting() {
        let direction = 0.5;
        let currentPosition = 0;
        this.interval = setInterval(() => {
            let width = 10;
            currentPosition += direction;
            if (currentPosition >= 100 - width || currentPosition <= 0) {
                direction *= -1;
            }
            this.bar.element.style.width = `${width}%`;
            this.bar.element.style.left = `${currentPosition}%`;
        }, 15);
    }

    stopWaiting() {
        clearInterval(this.interval);
        this.bar.element.style.left = `0%`;
    }

    hideBar() {
        this.bar.hide();
    }

    showBar() {
        this.bar.show();
    }

    setColor(color) {
        this.bar.element.style['background-color'] = color || '#4fa8df';
    }

    remove() {
        this.parent.removeChild(this.element);
    }

    add() {
        this.parent.appendChild(this.element);
    }

}

module.exports = ProgressBar;
