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

const Gui = require('./src/Gui.js');
const gui = require('./src/gui.js');
const ToggleElement = require('./src/ToggleElement.js');
//const ListGroup = require('./src/ListGroup.js');
const input = require('./src/input');
const ExtensionsManager = require('./src/ExtensionsManager.js');
const Workspace = require('./src/Workspace.js');

exports.gui = gui;
exports.Gui = Gui;
exports.ToggleElement = ToggleElement;
exports.input = input;
exports.ExtensionsManager = ExtensionsManager;
exports.Workspace = Workspace;
