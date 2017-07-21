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
const util = require('./util.js');
const gui = require('./gui.js');
class Modal extends ToggleElement {

    constructor(options) {
        options = options || {};
        let element = document.createElement('DIV');
        element.className = 'modal';
        element.zindex = 10000;

        let content = document.createElement('DIV');
        content.className = 'modal-content';

        if (options.draggable) {
            content.draggable = true;

            content.ondragstart = (ev) => {
                ev.dataTransfer.dropEffect = "move";
                content.y = Number(content.style.top.replace("px", ""));
                content.x = Number(content.style.left.replace("px", ""));
                content.mouseY = ev.clientY;
                content.mouseX = ev.clientX;
            }
            content.ondrag = (ev) => {}

            element.ondrop = (ev) => {
                let dX = ev.clientX - content.mouseX;
                let dY = ev.clientY - content.mouseY;
                content.style.left = `${content.x+dX}px`;
                content.style.top = `${content.y+dY}px`;
            }
            element.ondragover = (ev) => {
                ev.preventDefault();
            }
        }

        element.addEventListener('click', () => {
            this.destroy();
        });

        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });


        element.autofocus = true;
        element.addEventListener("keydown", (e) => {
            if (e.keyCode == 13) {  //enter
                if (typeof options.onsubmit === 'function') {
                    options.onsubmit();
                }
                this.destroy();
            }
            if (e.keyCode == 27 ) {  //escape or supr
                if (typeof options.oncancel === 'function') {
                    options.oncancel();
                }
                this.destroy();
            }
        });

        content.style.width = options.width || 'auto';
        content.style.height = options.height || 'auto';
        content.style.maxwidth = '90%';
        element.appendChild(content);
        //document.getElementsByTagName('BODY')[0].appendChild(element);
        options.parent = options.parent || gui.container;
        options.parent.appendChild(element);
        super(element);
        this.options = options;
        this.content = content;
        this.addTitle(options.title);
        this.addBody(options.body);
        this.hide();
    }

    destroy() {
        this.hide();
        this.clear();
        //document.getElementsByTagName('BODY')[0].removeChild(this.element);
        this.options.parent.removeChild(this.element);
    }

    addTitle(title) {
        this.header = document.createElement('DIV');
        this.header.className = 'modal-header';
        this.header.innerHTML = title;
        // if (!this.options.noCloseIcon) {
        //     let ic = util.icon('icon icon-cancel-circled pull-right ');
        //     ic.role = 'button';
        //     ic.onclick = () => {
        //         this.destroy();
        //     }
        //     this.header.appendChild(ic);
        // }
        this.content.insertBefore(this.header, this.content.firstChild);
    }

    addBody(body) {
        if (body) {
            if (body.appendChild) {
                body.className = body.className + ' modal-body';
                this.content.appendChild(body);
                this.body = body;
            } else if (typeof body === 'string') {
                this.body = document.createElement('DIV');
                this.body.innerHTML = body;
                this.content.appendChild(this.body);
            }
        }
    }

    addFooter(footer) {
        if (footer) {
            if (footer.appendChild) {
                footer.className = footer.className + ' modal-footer';
                this.content.appendChild(footer);
                this.footer = footer;
            } else if (typeof footer === 'string') {
                this.footee = document.createElement('DIV');
                this.footer.innerHTML = footer;
                this.content.appendChild(this.footer);
            }
        }
    }

    clear() {
        util.empty(this.element, this.element.firstChild);
    }

    show() {
        super.show();
    }


}





module.exports = Modal;
