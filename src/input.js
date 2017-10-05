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

'use strict';

const util = require('./util');


exports.checkButton = function(options) {

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
  if (options.icon){
    inp.appendChild(util.icon(options.icon));
  }
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

  if (options.parent) {
    if (options.makeContainer) {
      let cont = util.div('btn-group');
      cont.appendChild(inp);
      if (options.parent.appendChild) {
        options.parent.appendChild(cont);
      }
    } else {
      if (options.parent.appendChild) {
        options.parent.appendChild(inp);
      }
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
  inp.title = options.title || options.label || options.placeholder || '';
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
  inp.oncontextmenu = (event) => {
    if (typeof options.oncontextmenu === 'function') {
      options.oncontextmenu(inp, event);
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
