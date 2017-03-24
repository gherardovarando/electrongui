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

const ToggleElement = require('ToggleElement');

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