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
const {
    Menu,
    MenuItem
} = require('electron').remote;
const fs = require('fs');
const path = require('path');
const GuiExtension = require('./GuiExtension');
const Sidebar = require('./Sidebar.js');
const ToggleElement = require('./ToggleElement.js');
const util = require('./util.js');
const gui = require('./gui');


class ExtensionsManager extends GuiExtension {

    constructor() {
        super({
            menuLabel: 'Extensions',
            menuTemplate: [{
                label: 'Manager',
                click: () => {
                    this.show();
                }
            }, {
                type: 'separator'
            }]
        });
        this.extensions = {};
        gui.extensions = this.extensions;
        this.activate();
    }

    activate() {
        this.sidebar = new Sidebar(this.element);
        this.sidebar.addList();
        this.sidebar.hide();
        this.sidebar.list.addSearch({
            placeholder: 'Search extension'
        });

        //here put actions to load a new extension from custom file.
        this.pane = new ToggleElement(document.createElement('DIV'));
        this.element.appendChild(this.pane.element);
        this.appendMenu();
        gui.on('load:extension', (e) => {
            this.addExtension(e.extension);
        });
    }


    loadExtension(extPath, cl) {
        let ext;
        if (typeof extPath === 'string') {
            try {
                let tmp = require(extPath);
                if (tmp.prototype instanceof GuiExtension) {
                    ext = new tmp();
                    this.addExtension(this.extensions[ext.constructor.name]);
                }
            } catch (e) {
                console.log(e);
                ext = e;
            }
        } else {
            ext = 'trying to load non path extension';
        }
        if (typeof cl === 'function') {
            cl(ext);
        }
    }

    addTitle(title) {
        this.sidebar.list.addTitle(title);
    }

    hideAll() {
        Object.keys(this.extensions).map((name) => {
            this.extensions[name].hide();
        });
        this.hide();
    }



    addExtension(extension) {
        if (this.extensions[extension.constructor.name] instanceof GuiExtension) {
            this.extensions[extension.constructor.name].deactivate();
            this.sidebar.list.removeItem(extension.constructor.name);
        }
        this.extensions[extension.constructor.name] = extension;
        let menuitem = new MenuItem({
            label: extension.constructor.name,
            type: 'checkbox',
            click: (item) => {
                if (item.checked) {
                    extension.activate();
                } else {
                    extension.deactivate();
                }
            }
        });
        this.addMenuItem(menuitem);
        this.sidebar.addItem({
            id: extension.constructor.name,
            icon: `${extension.icon} fa-2x`,
            image: extension.image,
            title: extension.constructor.name,
            toggle: true,
            active: extension.active,
            onmouseover: () => {
                this.pane.clear();
                this.pane.appendChild(util.div(null, extension.constructor.name))
                this.pane.show();
            },
            onclick: {
                active: () => {
                    extension.activate();
                },
                deactive: () => {
                    extension.deactivate();
                }
            }
        });

        extension.on('deactivate', () => {
            this.sidebar.list.deactiveItem(extension.constructor.name);
            menuitem.checked = false;
        });

        extension.on('activate', () => {
            this.sidebar.list.activeItem(extension.constructor.name);
            menuitem.checked = true;
        });

        extension.on('show', () => {
            //gui.viewTrick();
            this.hide(); //hide the extensions manager
            //and all the other extensions:
            Object.keys(this.extensions).map((k) => {
                if (this.extensions[k] != extension) {
                    this.extensions[k].hide();
                }
            });
        });

        // extension.on('hide', () => {
        //     if (Object.keys(this.extensions).every((key) => {
        //             return this.extensions[key].isHidden();
        //         }) && this.isHidden()) {
        //     }
        // });

        this.emit('add', extension);

    }

    show() {
        this.hideAll();
        this.sidebar.show();
        super.show();
    }


    hide() {
        if (Object.keys(this.extensions).every((key) => {
                this.extensions[key].isHidden();
            }) && this.isHidden()) {}
        super.hide();
    }






}

module.exports = ExtensionsManager;
