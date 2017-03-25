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
const ToggleElement = require('./ToggleElement.js');

class ListGroup extends ToggleElement {
    constructor(parent) {
        if (parent.appendChild) {
            let element = document.createElement('UL');
            element.className = 'list-group';
            element.id = `${parent.id}List`;
            super(element);
            this.id = `${parent.id}List`;
            this.items = {};
            this.nItems = 0;
            this.appendTo(parent);
        }
    }

    addItem(options) {
        let li = document.createElement('LI');
        let item = new ToggleElement(li);
        li.className = 'list-group-item';

        // layout
        let mainContainer = util.div('main');
        li.appendChild(mainContainer);
        let detailsContainer = util.div('details');
        li.appendChild(detailsContainer);

        options.id = options.id || `${this.nItems}`;
        options.key = options.key || '';
        li.id = `${this.id}Item${options.id}`;

        if (typeof options.image === 'string') {
            let img = document.createElement('IMG');
            img.className = 'media-object pull-left';
            img.src = options.image;
            img.height = "30";
            img.width = "30";
            mainContainer.appendChild(img);
        } else if (typeof options.icon === 'string') {
            let icon = util.icon(`${options.icon} pull-left media-object`);
            mainContainer.appendChild(icon);
        }

        //media-body element
        let body = util.div('media-body');

        //title
        if (options.title) {
            if (typeof options.title.appendChild === 'function') {
                body.appendChild(options.title);
            } else {
                let title = document.createElement('STRONG');
                title.innerHTML = options.title;
                body.appendChild(title);
                options.key = `${options.key} ${options.title}`;
            }
        }

        //subtitle
        if (options.subtitle) {
            if (typeof options.subtitle.appendChild === 'function') {
                body.appendChild(options.subtitle);
            } else {
                let subtitle = util.div('', options.subtitle);
                body.appendChild(subtitle);
            }
        }

        //centerContainer.appendChild(body);
        mainContainer.appendChild(body);

        //details
        if (options.details) {
            if (options.details instanceof ToggleElement) {
                options.details.appendTo(detailsContainer);
            } else if (typeof options.details === 'string') {
                let cont = document.createElement('P');
                cont.innerHTML = options.details;
                detailsContainer.appendChild(cont);
            } else if (typeof options.details.appendChild === 'function') {
                detailsContainer.appendChild(options.details);
            }
            item.details = new ToggleElement(detailsContainer);
        }



        if (options.toggle) {
            li.role = 'button';

            li.onclick = (e) => {
                let done = false;
                if (li.classList.contains('active')) {
                    li.classList.remove('active');
                    if (options.onclick && typeof options.onclick.deactive === 'function') {
                        options.onclick.deactive(item, e);
                        done = true;
                    }
                } else {
                    if (options.onclick && typeof options.onclick.active === 'function') {
                        options.onclick.active(item, e);
                        done = true;
                    }
                    li.classList.add('active');
                }
                if (!done) {
                    if (typeof options.onclick === 'function') {
                        options.onclick(item, e);
                    }
                }
            };

        } else {
            li.role = 'button';
            li.onclick = options.onclick;
        }

        if (options.active) {
            li.classList.add('active');
        }

        if (typeof options.ondblclick === 'function') {
            li.role = 'button';
            li.ondblclick = (e) => {
                options.ondblclick(item, e)
            };
        }

        if (typeof options.oncontextmenu === 'function') {
            li.role = 'button';
            li.oncontextmenu = (e) => {
                options.oncontextmenu(item, e);
            }
        }

        if (typeof options.onmouseover  === 'function'){
          li.onmouseover = (e) =>{
            options.onmouseover(item,e);
          }
        }

        item.key = options.key; //set the search key
        this.element.appendChild(li);
        this.items[options.id] = item;
        this.nItems++;
    }

    setKey(id, newkey, append) {
        if (id === undefined || id === null) {
            return;
        }
        if (this.items[id]) {
            if (append) {
                this.items[id].key = this.items[id].key + newkey;
            } else {
                this.items[id].key = newkey;
            }
        }
    }

    removeKey(id, key) {
        if (id === undefined || id === null) {
            return;
        }
        if (this.items[id]) {
            this.items[id].key = this.items[id].key.replace(key, '');
        }
    }


    setTitle(id, newtitle) {
        if (id === undefined || id === null) {
            return;
        }
        if (this.items[id] instanceof ToggleElement) {
            this.removeKey(id, this.items[id].element.getElementsByTagName('STRONG')[0].innerHTML);
            this.items[id].element.getElementsByTagName('STRONG')[0].innerHTML = newtitle;
            this.setKey(id, newtitle, true);
        }
    }

    showItem(id) {
        if (id === undefined || id === null) {
            return;
        }
        if (this.items[id] instanceof ToggleElement) {
            this.items[id].show();
        }
    }

    hideitem(id) {
        if (id === undefined || id === null) {
            return;
        }
        if (this.items[id] instanceof ToggleElement) {
            this.items[id].hide();
        }
    }

    activeItem(id) {
        if (id === undefined || id === null) {
            return;
        }
        if (this.items[id] instanceof ToggleElement) {
            this.items[id].element.classList.add('active');
        }
    }


    deactiveItem(id) {
        if (id === undefined || id === null) {
            return;
        }
        if (this.items[id] instanceof ToggleElement) {
            this.items[id].element.classList.remove('active');
        }
    }


    showAll() {
        this.forEach(it => it.show());
    }

    hideAll() {
        this.forEach(it => it.hide());
    }


    activeAll() {
        this.forEach(it => it.element.classList.add('active'));
    }


    deactiveAll() {
        this.forEach(it => it.element.classList.remove('active'));
    }

    hideDetails(item) {

    }

    hideAllDetails() {
        this.forEach((it) => {
            it.hideDetails();
        });
    }

    forEach(f) {
        for (let t in this.items) {
            f(this.items[t]);
        }
    }


    removeItem(id) {
        if (id === undefined || id === null) {
            return;
        }
        let item = this.items[id];
        if (item === undefined || item === null) {
            return;
        }
        if (item instanceof ToggleElement) {
            this.element.removeChild(item.element);
            delete this.items[id];
            delete this.items[id];
            //this.nItems--;
        }
    }


    clean() {
        Object.keys(this.items).map((id) => {
            this.removeItem(id);
        });
    }

    addSearch(options) {
        options = options || {};
        let li = document.createElement('LI');
        li.className = 'list-group-header';
        let input = document.createElement('INPUT');
        input.className = 'form-control';
        input.type = 'search';
        input.placeholder = options.placeholder || 'Search';
        input.onsearch = () => {
            this.showAll();
            let val = input.value;
            for (let it in this.items) {
                if (this.items[it].key.toLowerCase().includes(val.toLowerCase()) || val === '') {
                    this.items[it].show();
                } else {
                    this.items[it].hide();
                }
            }
        };

        li.appendChild(input);
        this.element.insertBefore(li, this.element.firstChild);
        this.search = input;
    }

}

module.exports = ListGroup;
