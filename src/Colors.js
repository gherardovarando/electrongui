// Copyright (c) 2016 Gherardo Varando (gherardo.varando@gmail.com)
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
const input = require('./input');
const Modal = require('./Modal');
const util = require('./util');
const ButtonsContainer = require('./ButtonsContainer');
const {
    Menu,
    MenuItem,
} = require('electron').remote;

let colors = ['blue', 'red', 'pink', 'orange', 'yellow', 'green', 'purple', 'black', 'white'];



exports.getColors = function() {
    return (colors);
}

exports.defineNewColor = function() {
    let modal = new Modal({
        title: "Define color",
        height: "auto"
    });
    let body = util.div();
    let color = '#000000';
    let colorPickerContainer = util.div('color-picker-wrapper');
    colorPickerContainer.style.backgroundColor = color;
    body.appendChild(colorPickerContainer);
    input.input({
        parent: colorPickerContainer,
        id: 'cP0',
        className: '',
        value: color,
        label: '',
        type: 'color',
        oninput: (inp) => {
            color = inp.value;
            document.getElementById('cP1').value = inp.value;
            colorPickerContainer.style.backgroundColor = inp.value;
        }
    });
    input.input({
        parent: body,
        id: 'cP1',
        className: '',
        label: '',
        value: color,
        type: 'text',
        placeholder: 'color',
        oninput: (inp) => {
            color = inp.value;
            document.getElementById('cP0').value = inp.value;
            colorPickerContainer.style.backgroundColor = inp.value;
        }
    });
    let buttonsContainer = new ButtonsContainer(document.createElement("DIV"));
    buttonsContainer.addButton({
        id: "CancelColor0",
        text: "Cancel",
        action: () => {
            modal.destroy();
        },
        className: "btn-default"
    });
    buttonsContainer.addButton({
        id: "SaveColor0",
        text: "Add",
        action: () => {
            colors.push(color);
            modal.destroy();
        },
        className: "btn-default"
    });
    let footer = util.div();
    footer.appendChild(buttonsContainer.element);
    modal.addBody(body);
    modal.addFooter(footer);
    modal.show();
}


exports.menu = function(options) {
    options = options || {};
    options.color = options.color || 'none';
    let menu = new Menu();
    colors.map((col) => {
        menu.append(new MenuItem({
            label: col,
            type: 'radio',
            checked: col === options.color,
            click: () => {
                if (typeof options.click === 'function') {
                    options.click(col);
                }
            }
        }));
    });
    if (options.defineNew) {
        menu.append(new MenuItem({
            label: 'Define new',
            click: () => {
                exports.defineNewColor();
            }
        }));
    }
    return menu;
}
