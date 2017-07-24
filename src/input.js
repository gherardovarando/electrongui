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




exports.checkButton = function(options) {
    let cont = document.createElement('DIV');
    cont.classList.add('btn-group');
    let inp = document.createElement('BUTTON');
    inp.className = options.className || '';
    inp.id = options.id || '';
    inp.classList.add('btn');
    inp.classList.add('check-button');
    if (options.active) {
        inp.classList.add('active');
    }
    options.id = options.id || '';
    inp.id = options.id;
    inp.type = 'button';
    inp.innerHTML = options.text;
    inp.onclick = () => {
        if (inp.classList.contains('active')) {
            inp.classList.remove('active');

            if (typeof options.onactivate === 'function') {
                options.ondeactivate(inp, inp.classList.contains('active'));
            }
        } else {
            inp.classList.add('active');
            if (typeof options.ondeactivate === 'function') {
                options.onactivate(inp);
            }
        }
        if (typeof options.onclick === 'function') {
            options.onclik(inp, !inp.classList.contains('active'));
        }
    }
    if (options.autofocus) {
        inp.autofocus = true;
    }
    cont.appendChild(inp);
    if (options.parent) {
        if (options.parent.appendChild) {
            options.parent.appendChild(cont);
        }
    }

    return inp;

}


exports.selectInput = function(options) {
    let inp = document.createElement('SELECT');
    options.id = options.id || '';
    inp.className = options.className || '';
    if (options.autofocus) {
        inp.autofocus = true;
    }
    inp.onchange = () => {
        if (typeof options.onchange === 'function') {
            options.onchange(inp);
        }
    };
    inp.onblur = () => {
        if (typeof options.onblur === 'function') {
            options.onblur(inp);
        }
    };
    inp.oninput = () => {
        if (typeof options.oninput === 'function') {
            options.oninput(inp);
        }
    };

    if (options.choices) {
        if (options.choices.constructor == Object) {
            Object.keys(options.choices).map((key) => {
                let option = document.createElement("option");
                option.text = options.choices[key];
                option.value = key;
                inp.add(option);
            });
        } else {
            options.choices.map((key) => {
                let option = document.createElement("option");
                option.text = key;
                inp.add(option);
            });
            inp.value = options.value || options.choices[0];
        }
    }

    if (options.parent) {
        if (options.parent.appendChild) {
            let l = document.createElement('LABEL');
            l.className = 'input-label';
            l.htmlFor = options.id;
            l.innerHTML = options.label;
            l.appendChild(inp);
            options.parent.appendChild(l);
        }
    }

    return inp;

}


exports.input = function(options) {
    let inp = document.createElement('INPUT');
    inp.type = options.type || 'text';
    inp.id = options.id || '';
    inp.className = options.className;
    inp.value = options.value;
    if (options.autofocus) {
        inp.autofocus = true;
    }
    if (inp.type === 'date') {
        inp.valueAsDate = options.valueAsDate; //for type=date
    }
    inp.placeholder = options.placeholder || '';
    inp.min = options.min;
    inp.max = options.max;
    if (options.width) {
        inp.width = options.width;
    }
    if (options.height) {
        inp.height = options.height;
    }
    inp.title = options.title || options.label || '';
    inp.step = options.step;
    inp.checked = options.checked;
    inp.readOnly = options.readOnly || false;

    inp.onchange = (event) => {
        if (typeof options.onchange === 'function') {
            options.onchange(inp, event);
        }
    };
    inp.onblur = (event) => {
        if (typeof options.onblur === 'function') {
            options.onblur(inp, event);
        }
    };
    inp.oninput = (event) => {
        if (typeof options.oninput === 'function') {
            options.oninput(inp, event);
        }
    };
    inp.ondblclick = (event) => {
        if (typeof options.ondblclick === 'function') {
            options.ondblclick(inp, event);
        }
    }
    inp.onfocusout = (event) => {
        if (typeof options.onfocusout === 'function') {
            options.onfocusout(inp, event);
        }
    }
    inp.onclick = (event) => {
        if (typeof options.onclick === 'function') {
            options.onclick(inp, event);
        }
    }

    if (options.parent) {
        if (options.parent.appendChild) {
            let l = document.createElement('LABEL');
            l.className = 'input-label';
            l.htmlFor = options.id || '';
            l.innerHTML = options.label;
            l.appendChild(inp);
            options.parent.appendChild(l);
        }
    }
    return inp;

}
