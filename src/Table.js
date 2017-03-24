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
const {dialog} = require('electron').remote;
const json2csv = require('json2csv');
const fs = require('fs');

/**
 * This class transforms data into an HTML table.
 * It also allows you to export the data from the table to a CSV file.
 * 
 * @class Table
 * @extends {ToggleElement}
 */
class Table extends ToggleElement {

    /**
     * Creates a Table.
     */
    constructor() {
        var element = document.createElement('TABLE');
        element.className = "table-striped";
        super(element);
        this.thead = document.createElement('THEAD');
        this.tbody = document.createElement('TBODY');
        this.columnNames = [];
        element.appendChild(this.thead);
        element.appendChild(this.tbody);
    }

    /**
     * Adds a row to the table. A row must be a JSON object with the following format:
     * {
     *  "column_1 name" : {
     *      col_value : "column_1 value"
     *  },
     *  "column_2 name" : {
     *      col_value : "column_2 value"
     *  },
     *  ...
     * }
     * 
     * @param {Object} rowData - Row data.
     */
    addRow(rowData) {
        if (!this.thead.hasChildNodes()) {
            this.setHeader(rowData);
        }

        let tr = document.createElement('TR');

        this.columnNames.map((columnName) => {
            if (Object.keys(rowData).indexOf(columnName) >= 0) {
                let td = document.createElement('TD');
                td.innerHTML = rowData[columnName].col_value;
                tr.appendChild(td);
            } else {
                let td = document.createElement('TD');
                tr.appendChild(td);
            }
        });

        Object.keys(rowData).map((key) => {
            if (this.columnNames.indexOf(key) < 0) {
                this.addColHead(key);
                let td = document.createElement('TD');
                td.innerHTML = rowData[key].col_value;
                tr.appendChild(td);
            }

        });

        this.tbody.appendChild(tr);
    }

    /**
     * Sets the header row of the table using column names.
     * 
     * @param {Object} rowData - Row data.
     */
    setHeader(rowData) {
        let tr = document.createElement('TR');
        this.thead.tr = tr;
        Object.keys(rowData).map((key) => {
            this.addColHead(rowData[key].col_name);
        });
        this.thead.appendChild(tr);
    }

    /**
     * Adds a column header (th) given a column name.
     * 
     * @param {string} colName - Column name.
     */
    addColHead(colName) {
        let th = document.createElement('TH');
        th.innerHTML = colName;
        this.columnNames.push(colName);
        this.thead.tr.appendChild(th);
    }

    /**
     * Exports the table to a CSV file.
     * Opens a dialog asking where to save the file.
     * 
     * @param {string} dialogTitle - Save dialog title.
     */
    exportToCSV(dialogTitle) {
        if (this.thead.hasChildNodes()) {
            var fields = Array.from(this.thead.firstChild.children).map((child) => child.innerHTML);

            if (this.tbody.hasChildNodes()) {
                var rows = Array.from(this.tbody.children).map((tr) => {
                    var row = {};
                    Object.keys(fields).map((key) => {
                        row[fields[key]] = tr.children[key].innerHTML;
                    });
                    return row;
                });

                dialog.showSaveDialog({
                    title: dialogTitle,
                    type: 'normal',
                    filters: [{
                        name: 'CSV',
                        extensions: ['csv']
                    }]
                }, (filename) => {
                    let cont = json2csv({
                        data: rows,
                        fields: fields
                    });
                    fs.writeFile(filename, cont);
                });
            }
        }
    }
}

module.exports = Table;
