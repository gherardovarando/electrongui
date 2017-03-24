/**
 * @author : Mario Juez (mario@mjuez.com)
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

const ToggleElement = require('./ToggleElement.js');

/**
 * Class representing an HTML element to select a folder.
 *
 * @class FolderSelector
 * @extends {ToggleElement}
 */
class FolderSelector extends ToggleElement {

    /**
     * Creates a FolderSelector.
     *
     * @param {string} id - HTML element id.
     */
    constructor(id,options) {
        options = options || {};
        let element = document.createElement("DIV");
        id = id || "folderinput";
        super(element);

        this.outputFolderPath = undefined;

        this.folderInput = document.createElement("INPUT");
        this.folderInput.id = id;
        this.folderInput.type = "file";
        this.folderInput.className = "folderselector";
        this.folderInput.webkitdirectory = true;
        element.appendChild(this.folderInput);

        let btnSelectFolder = document.createElement("BUTTON");
        btnSelectFolder.className = "btn btn-default";
        btnSelectFolder.innerHTML = "<span class=\"fa fa-folder-open\"></span> Choose folder";
        btnSelectFolder.onclick = (e) => {
            this.folderInput.click();
        };
        element.appendChild(btnSelectFolder);

        this.selectedFolder = document.createElement("DIV");
        this.selectedFolder.innerHTML = options.label || "Please, choose an output folder.";
        element.appendChild(this.selectedFolder);

        this.folderInput.onchange = (e) => {
            if (this.folderInput.files[0]) {
                this.outputFolderPath = this.folderInput.files[0].path;
                this.selectedFolder.innerHTML = this.outputFolderPath;
            }
        };
    }

    /**
     * Gets the selected folder path.
     *
     * @returns {string} a path to the selected folder.
     */
    getFolderRoute() {
        return this.outputFolderPath;
    }

}

module.exports = FolderSelector;
