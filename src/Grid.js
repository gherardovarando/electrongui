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

class Grid extends ToggleElement {

    constructor(rows, columns) {
        var element = document.createElement("TABLE");
        element.className = "grid";
        super(element);

        this.rows = rows;
        this.columns = columns;
        this.actualRow = 0;
        this.actualColumn = 0;

        for (var i = 0; i < rows; i++) {
            var row = document.createElement("TR");
            for (var j = 0; j < columns; j++) {
                var column = document.createElement("TD");
                row.appendChild(column);
            }
            element.appendChild(row);
        }
    }

    addElement(element, row, column) {
        if (row === undefined && column === undefined) {
            row = this.actualRow;
            column = this.actualColumn;
            if (this.actualRow + 1 < this.rows) {
                this.actualRow += 1;
            } else if (this.actualColumn + 1 < this.columns) {
                this.actualRow = 0;
                this.actualColumn += 1;
            } else {
                return false;
            }
        }
        var target = this.element.children[row].children[column];
        target.appendChild(element);
        return true;
    }
}

module.exports = Grid;
