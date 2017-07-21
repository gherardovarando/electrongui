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
