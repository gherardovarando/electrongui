// Copyright (c) 2016 Mario Juez (mjuez@fi.upm.es)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
  constructor(id, options) {
    options = options || {};
    options.text = options.text || "Choose folder";
    options.icon = options.icon || "fa fa-folder-open";
    let element = document.createElement("DIV");
    element.className = options.className || '';
    element.title = options.title || '';
    id = id || "folderinput";
    super(element);

    this.outputFolderPath = options.value;

    this.folderInput = document.createElement("INPUT");
    this.folderInput.id = id;
    this.folderInput.type = "file";
    this.folderInput.className = "folderselector";
    this.folderInput.webkitdirectory = true;
    element.appendChild(this.folderInput);

    let btnSelectFolder = document.createElement("BUTTON");
    btnSelectFolder.className = "btn btn-default";
    btnSelectFolder.innerHTML = `<span class=" ${options.icon}  "></span> ${options.text}`;
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
