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
const storage = require('electron-json-storage');
const ToggleElement = require('./ToggleElement');
const fs = require('fs');
const {
    dialog
} = require('electron').remote;
const util = require('./util.js');
//const {TreeList} = require('TreeList');
const GuiExtension = require('./GuiExtension.js');
let gui = require('./gui');

class Workspace extends GuiExtension {
    constructor() {
        super();
        this.locked = true;
        window.addEventListener('beforeunload', (e) => {
            storage.set('workspace', this.spaces, (error) => {});
        });
        this.activate();
    }

    activate() {
        super.activate();
        this.spaces = {
            workspace: {
                path: ''
            }
        };
        storage.get('workspace', (error, data) => {
            if (error) return;
            if (data.workspace) {
                this.spaces = data || this.spaces;
                this.emit('load');
            }
        });

        gui.header.actionsContainer.addButton({
            id:'save',
            groupId: 'basetools',
            icon: 'fa fa-save',
            action: () => {
                this.save();
            }
        });

        gui.header.actionsContainer.addButton({
            id: 'load',
            groupId: 'basetools',
            icon: 'fa fa-folder-open-o',
            action: () => {
                this.loadChecking();
            }
        });
        //this.pane = new ToggleElement(document.createElement('DIV'));
        //this.pane.element.className = 'pane padded';
        //this.treeView = new TreeList(this.pane.element, this.spaces);
        //this.element.appendChild(this.pane.element);

        // this.addToggleButton({
        //     groupId: 'basetools',
        //     icon: 'fa fa-cubes',
        //     buttonsContainer: gui.header.actionsContainer
        // });


    }

    deactivate() {
        //this.removeToggleButton();
        gui.header.actionsContainer.removeButton('save');
        gui.header.actionsContainer.removeButton('load');
        this.clear();
        super.deactivate();
    }

    show() {
        //super.show();
    }

    addSpace(extension, object, overwrite) {
        if (object) {
            if (!overwrite && this.spaces[extension.constructor.name]) return;
            this.spaces[extension.constructor.name] = object;

        } else {
            if (extension._space) {
                this.addSpace(extension, extension._space);
            }
        }
    }

    newWorkspace(path) {
        this.spaces = {
            workspace: {
                path: path || ''
            }
        };
        this.emit('load');
    }

    reg() {
        storage.set('workspace', this.spaces);
    }

    safequit() {
        storage.set('workspace', this.spaces, (error) => {
            app.quit();
        });
    }

    removeSpace(extension) {
        delete this.spaces[extension.constructor.name];
    }

    newChecking() {
        if (Object.keys(this.spaces).length < 2) {
            this.load();
            return;
        }
        dialog.showMessageBox({
            title: 'Save workspace?',
            type: 'warning',
            buttons: ['Cancel', "Don't save", 'Save'],
            message: `Save the current workspace before creating a new one?`,
            detail: `Your changes will be lost if you do not save them`,
            noLink: true
        }, (id) => {
            if (id > 0) {
                if (id > 1) {
                    this.save(this.spaces.workspace.path, () => {
                        this.newWorkspace();
                    });
                } else {
                    this.newWorkspace();
                }
            }
        });
    }

    loadChecking() {
        if (Object.keys(this.spaces).length < 2) {
            this.load();
            return;
        }
        dialog.showMessageBox({
            title: 'Save workspace?',
            type: 'warning',
            buttons: ['Cancel', "Don't save", 'Save'],
            message: `Save the current workspace before opening a new one?`,
            detail: `Your changes will be lost if you do not save them`,
            noLink: true
        }, (id) => {
            if (id > 0) {
                if (id > 1) {
                    this.save(this.spaces.workspace.path, () => {
                        this.load();
                    });
                } else {
                    this.load();
                }
            }
        });
    }


    save(path, callback) {
        let content = JSON.stringify(this.spaces);
        if (typeof path === 'string' && path != '') {
            fs.writeFile(path, content, () => {
                this.spaces.workspace.path = path;
                storage.set('workspace', this.spaces);
                if (callback) {
                    callback(path);
                }
            });
            return;
        }
        dialog.showSaveDialog({
                title: 'Save the  current Workspace',
                filters: [{
                    name: 'JSON',
                    extensions: ['json']
                }]
            },
            (fileName) => {
                let cl = callback;

                if (fileName === undefined) {
                    gui.notify("You didn't save the workspace");
                    return;
                }

                fs.writeFile(fileName, content, (err) => {
                    if (err) {
                        gui.notify("An error ocurred creating the file " + err.message)
                    }
                    this.spaces.workspace.path = fileName;
                    storage.set('workspace', this.spaces);
                    gui.notify(`The workspace has been succesfully saved`);
                    if (cl) {
                        cl();
                    }
                });
            });
    }


    load(path) {
        if (typeof path === 'string' && path != '') {
            wk = util.readJSONsync(path);
            this.spaces = wk;
            storage.set('workspace', this.spaces);
            this.spaces.workspace = this.spaces.workspace || {
                path: ''
            };
            this.emit('load');
            return;
        }
        dialog.showOpenDialog({
            title: "Load a Workspace",
            filters: [{
                name: 'JSON',
                extensions: ['json']
            }],
            properties: ['openFile']
        }, (file) => {
            let wk;
            try {
                wk = util.readJSONsync(file[0]);
            } catch (e) {
                gui.notify(e);
                return;
            }
            try {
                this.spaces = wk;
                this.spaces.workspace = this.spaces.workspace || {
                    path: ''
                };
                storage.set('workspace', this.spaces);
                this.emit('load');
            } catch (e) {
                gui.notify(e);
            }
        });
    }


}


module.exports = Workspace;
