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

class TreeList extends ToggleElement {
    constructor(parent, obj, title) {
        if (parent.appendChild) {
            let element = document.createElement('DIV');
            element.className = 'list-group';
            element.id = `${parent.id}TreeList`;
            super(element);
            this.id = `${parent.id}TreeList`;
            this.addItem(this, JSON.parse(JSON.stringify(obj)));
            this.show();
            this.appendTo(parent);
        }
    }
    addItem(root, object) {
        try {
            if (typeof object === 'object') {
                if (Array.isArray(object)) {
                    root.hide();
                    root.next = [];
                    for (let t = 0; t < object.length; t++) {
                        let title = document.createElement('STRONG');
                        title.className = 'tree-list-item-title array';
                        title.innerHTML = `${t} `;
                        title.role = 'button';
                        let cont = document.createElement('DIV');
                        cont.className = 'tree-list-item-body array';
                        cont.appendChild(title);
                        let next = new ToggleElement(document.createElement('DIV'));
                        next.element.className = 'tree-list-item array';
                        title.onclick = (event) => {
                            event.stopPropagation();
                            next.toggle();
                        };
                        cont.appendChild(next.element);
                        root.element.appendChild(cont);
                        this.addItem(next, object[t]);
                        root.next[t] = next;
                    }
                } else {
                    root.hide();
                    root.next = {};
                    for (let t in object) {
                        let title = document.createElement('STRONG');
                        title.className = 'tree-list-item-title';
                        title.innerHTML = `${t} `;
                        title.role = 'button';
                        let cont = document.createElement('DIV');
                        cont.className = 'tree-list-item-body';
                        cont.appendChild(title);
                        let next = new ToggleElement(document.createElement('DIV'));
                        next.element.className = 'tree-list-item';
                        cont.appendChild(next.element);
                        root.element.appendChild(cont);
                        title.onclick = (event) => {
                            event.stopPropagation();
                            next.toggle();
                        };
                        this.addItem(next, object[t]);
                        root.next[t] = next;
                    }
                }
            } else {
                let div = document.createElement('DIV');
                div.innerHTML = object;
                div.className = `tree-list-field`;
                root.element.appendChild(div);
                root.next = object;
            }
        } catch (e) {
            throw e;
        }
    }


    setObject(object) {
        Util.empty(this.element, this.element.firstChild);
        this.addItem(this, JSON.parse(JSON.stringify(object)));
    }


}


class TreeListInput extends ToggleElement {
    constructor(parent, obj, title) {
        if (parent.appendChild) {
            let element = document.createElement('DIV');
            element.className = 'list-group';
            element.id = `${parent.id}TreeList`;
            super(element);
            this.id = `${parent.id}TreeList`;
            this.addItem(this, JSON.parse(JSON.stringify(obj)));
            this.appendTo(parent);
            this.show();
        }
    }

    activate() {
        this.element.className = 'tree-list-item';
    }

    inactivate() {
        this.element.className = 'tree-list-item inactive';
    }



    addItem(root, object) {
        try {
            if (typeof object === 'object') {
                if (Array.isArray(object)) {
                    root.hide();
                    root.next = [];
                    for (let t = 0; t < object.length; t++) {
                        let title = document.createElement('STRONG');
                        title.className = 'tree-list-item-title array';
                        title.innerHTML = `${t} `;
                        title.role = 'button';
                        let cont = document.createElement('DIV');
                        cont.className = 'tree-list-item-body array';
                        cont.appendChild(title);
                        let next = new ToggleElement(document.createElement('DIV'));
                        next.element.className = 'tree-list-item array';
                        title.onclick = (event) => {
                            event.stopPropagation();
                            next.toggle();
                        };
                        cont.appendChild(next.element);
                        root.element.appendChild(cont);
                        this.addItem(next, object[t]);
                        root.next[t] = next;
                    }
                } else {
                    root.hide();
                    root.next = {};
                    for (let t in object) {
                        let title = document.createElement('STRONG');
                        title.className = 'tree-list-item-title';
                        title.innerHTML = `${t} `;
                        title.role = 'button';
                        let cont = document.createElement('DIV');
                        cont.className = 'tree-list-item-body';
                        cont.appendChild(title);
                        let next = new ToggleElement(document.createElement('DIV'));
                        next.element.className = 'tree-list-item';
                        cont.appendChild(next.element);
                        root.element.appendChild(cont);
                        title.onclick = (event) => {
                            event.stopPropagation();
                            next.toggle();
                        };
                        this.addItem(next, object[t]);
                        root.next[t] = next;
                    }
                }
            } else {
                let div = document.createElement('INPUT');
                div.value = object;
                switch (typeof object) {
                    case 'string':
                        div.type = 'text';
                        break;
                    case 'number':
                        div.type = 'number';
                        break;
                    case 'boolean':
                        div.type = 'checkbox';
                        div.checked = object;
                        div.value = Boolean(div.value);
                        break;
                    default:
                        div.typ = 'text';
                }
                div.size = `${div.value}`.length + 1;
                div.className = `tree-list-field`;
                div.onblur = () => {
                    switch (typeof object) {
                        case 'string':
                            root.next = div.value;
                            break;
                        case 'number':
                            root.next = Number(div.value);
                            break;
                        case 'boolean':
                            root.next = Boolean(div.checked);
                            break;
                        default:
                            root.next = div.value;
                    }
                };
                div.oninput = () => {
                    div.size = `${div.value}`.length + 1;
                };
                root.element.appendChild(div);
                root.next = object;
            }
        } catch (e) {
            throw e;
        }
    }


    getObject(root) {
        if (typeof root === 'undefined') return (this.getObject(this));
        switch (typeof root.next) {
            case 'object':
                if (Array.isArray(root.next)) {
                    return (root.next.map((el) => {
                        return this.getObject(el);
                    }));
                } else {
                    let tmp = {};
                    let val = Object.keys(root.next).map((x) => {
                        tmp[x] = this.getObject(root.next[x]);
                    });
                    return (tmp);
                }
                break;
            case 'string':
                return root.next;
                break;
            case 'number':
                return Number(root.next);
                break;
            case 'boolean':
                return Boolean(root.next);
                break;
            default:
                return root.next;
        }
    }

    clean() {

    }

    setObject(object) {

    }

}


exports.TreeList = TreeList;
exports.TreeListInput = TreeListInput;
