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

const util = require('./util.js');
const ToggleElement = require('./ToggleElement.js');

class ListGroup extends ToggleElement {
  constructor() {
    let id;
    let parent;
    if (typeof arguments[0] == 'string') {
      id = arguments[0];
      if (arguments[1]) {
        if (arguments[1].appendChild) {
          parent = arguments[0];
        }
      }
    } else if (arguments[0].appendChild) {
      parent = arguments[0];
    }
    let element = document.createElement('UL');
    element.className = 'list-group';
    element.id = `${id}`;
    super(element);
    this.id = `${id}`;
    this.items = {};
    this.nItems = 0;
    if (parent) {
      if (typeof parent.appendChild === 'function') {
        this.appendTo(parent);
      }
    }
  }

  addItem(options) {
    let li = document.createElement('LI');
    let item = new ToggleElement(li);
    li.className = 'list-group-item';

    // layout
    let mainContainer = util.div('main');
    li.appendChild(mainContainer);
    let detailsContainer = util.div('details');
    li.appendChild(detailsContainer);

    if (options.id === null || options.id === undefined) {
      options.id = this.nItems++;
    }
    options.key = options.key || '';
    li.id = `${this.id}Item${options.id}`;

    if (typeof options.image === 'string') {
      let img = document.createElement('IMG');
      img.className = 'media-object pull-left';
      img.src = options.image;
      img.height = "30";
      img.width = "30";
      mainContainer.appendChild(img);
    } else if (typeof options.icon === 'string') {
      let icon = util.icon(`${options.icon} pull-left media-object`);
      mainContainer.appendChild(icon);
    }

    //media-body element
    let body = util.div('media-body');

    //title
    if (options.title) {
      let title;
      if (typeof options.title.appendChild === 'function') {
        title = options.title.element || options.title;
        body.appendChild(options.title);
        if (options.title.classList) {
          options.title.classList.add('list-group-item-title');
        } else if (options.title.element && options.title.element.classList) {
          options.title.element.classList.add('list-group-item-title');
        }
      } else {
        title = document.createElement('STRONG');
        title.innerHTML = options.title;
        title.classList.add('list-group-item-title');
        body.appendChild(title);
        options.key = `${options.key} ${options.title}`;
      }
      body.appendChild(title);
      item._title = title;
    }

    //subtitle
    if (options.subtitle) {
      if (typeof options.subtitle.appendChild === 'function') {
        body.appendChild(options.subtitle);
      } else {
        let subtitle = util.div('', options.subtitle);
        body.appendChild(subtitle);
      }
    }

    //centerContainer.appendChild(body);
    mainContainer.appendChild(body);

    //details
    if (options.details) {
      if (options.details instanceof ToggleElement) {
        options.details.appendTo(detailsContainer);
      } else if (typeof options.details === 'string') {
        let cont = document.createElement('P');
        cont.innerHTML = options.details;
        detailsContainer.appendChild(cont);
      } else if (typeof options.details.appendChild === 'function') {
        detailsContainer.appendChild(options.details);
      }
      item.details = new ToggleElement(detailsContainer);
    }



    if (options.toggle) {
      li.role = 'button';

      li.onclick = (e) => {
        let done = false;
        if (li.classList.contains('active')) {
          li.classList.remove('active');
          if (options.onclick && typeof options.onclick.deactive === 'function') {
            options.onclick.deactive(item, e);
            done = true;
          }
        } else {
          if (options.onclick && typeof options.onclick.active === 'function') {
            options.onclick.active(item, e);
            done = true;
          }
          li.classList.add('active');
        }
        if (!done) {
          if (typeof options.onclick === 'function') {
            options.onclick(item, e);
          }
        }
      };

    } else {
      li.role = 'button';
      li.onclick = options.onclick;
    }

    if (options.active) {
      li.classList.add('active');
    }

    if (typeof options.ondblclick === 'function') {
      li.role = 'button';
      li.ondblclick = (e) => {
        options.ondblclick(item, e)
      };
    }

    if (typeof options.oncontextmenu === 'function') {
      li.role = 'button';
      li.oncontextmenu = (e) => {
        options.oncontextmenu(item, e);
      }
    }

    if (typeof options.onmouseover === 'function') {
      li.onmouseover = (e) => {
        options.onmouseover(item, e);
      }
    }

    item.key = options.key; //set the search key
    this.element.appendChild(li);
    item._id = options.id;
    this.items[options.id] = item;
    this.nItems++;
  }

  setKey(id, newkey, append) {
    if (id === undefined || id === null) {
      return;
    }
    if (this.items[id]) {
      if (append) {
        this.items[id].key = this.items[id].key + newkey;
      } else {
        this.items[id].key = newkey;
      }
    }
  }

  removeKey(id, key) {
    if (id === undefined || id === null) {
      return;
    }
    if (this.items[id]) {
      this.items[id].key = this.items[id].key.replace(key, '');
    }
  }

  clean() {
    this.forEach((it) => {
      this.removeItem(it);
    });
  }



  setTitle(id, newtitle) {
    if (id === undefined || id === null) {
      return;
    }
    let title = this.items[id]._title;
    let titletx = '';
    if (this.items[id] instanceof ToggleElement) {
      if (title instanceof ToggleElement) {
        title = title.element;
      }
      if (typeof title.value === 'string') {
        titletx = title.value;
        title.value = newtitle;
      } else {
        titletx = title.innerHTML;
        title.innerHTML = newtitle;
      }
      this.removeKey(id, titletx);
      this.setKey(id, newtitle, true);
    }
  }

  showItem(id) {
    if (id === undefined || id === null) {
      return;
    }
    if (this.items[id] instanceof ToggleElement) {
      this.items[id].show();
    }
  }

  hideitem(id) {
    if (id === undefined || id === null) {
      return;
    }
    if (this.items[id] instanceof ToggleElement) {
      this.items[id].hide();
    }
  }

  activeItem(id) {
    if (id === undefined || id === null) {
      return;
    }
    if (id instanceof ToggleElement) {
      id.element.classList.add('active');
    }
    if (this.items[id] instanceof ToggleElement) {
      this.items[id].element.classList.add('active');
    }
  }


  deactiveItem(id) {
    if (id === undefined || id === null) {
      return;
    }
    if (this.items[id] instanceof ToggleElement) {
      this.items[id].element.classList.remove('active');
    }
  }


  showAll() {
    this.forEach(it => it.show());
  }

  hideAll() {
    this.forEach(it => it.hide());
  }


  activeAll() {
    this.forEach(it => it.element.classList.add('active'));
  }


  deactiveAll() {
    this.forEach(it => it.element.classList.remove('active'));
  }

  hideDetails(id) {
    if (id === undefined || id === null) {
      return;
    }
    this.items[id].details.hide();
  }

  showDetails(id) {
    if (id === undefined || id === null) {
      return;
    }
    this.items[id].details.show();
  }

  hideAllDetails() {
    this.forEach((it) => {
      if (it.details instanceof ToggleElement) {
        it.details.hide();
      }
    });
  }

  forEach(f) {
    for (let t in this.items) {
      f(this.items[t]);
    }
  }


  removeItem(id) {
    if (id === undefined || id === null) {
      return;
    }
    let item;
    if (id instanceof ToggleElement) {
      item = id;
      id = item._id;
    } else {
      item = this.items[id];
    }
    if (item === undefined || item === null) {
      return;
    }
    if (item instanceof ToggleElement) {
      this.element.removeChild(item.element);
      delete this.items[id];
      delete this.items[id];
      //this.nItems--;
    }
  }


  addSearch(options) {
    options = options || {};
    let li = document.createElement('LI');
    li.className = 'list-group-header';
    let input = document.createElement('INPUT');
    input.className = 'form-control';
    input.type = 'search';
    input.placeholder = options.placeholder || 'Search';
    input.onsearch = () => {
      this.showAll();
      let val = input.value;
      for (let it in this.items) {
        if (this.items[it].key.toLowerCase().includes(val.toLowerCase()) || val === '') {
          this.items[it].show();
        } else {
          this.items[it].hide();
        }
      }
    };

    li.appendChild(input);
    this.element.insertBefore(li, this.element.firstChild);
    this.search = input;
  }

}

module.exports = ListGroup;
