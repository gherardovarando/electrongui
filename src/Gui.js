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

const EventEmitter = require('events');
const ProgressBar = require('./ProgressBar');
const fs = require('fs');
const {
  Menu,
  MenuItem,
  BrowserWindow
} = require('electron').remote;
const ToggleElement = require('./ToggleElement');
const ButtonsContainer = require('./ButtonsContainer');
let child;


class Header extends ToggleElement {
  constructor(element) {
    super(element);
    this.id = element.id;
    let actionsContainer;
    if (element.getElementsByClassName("toolbar-actions")[0]) {
      actionsContainer = element.getElementsByClassName("toolbar-actions")[0];
    } else {
      actionsContainer = document.createElement("DIV");
      actionsContainer.className = 'toolbar-actions';
      actionsContainer.id = "header-actions";
      this.element.appendChild(actionsContainer);
    }
    this.actionsContainer = new ButtonsContainer(actionsContainer);
  }

  setTitle(title) {
    let tl = this.element.getElementsByClassName('title')[0];
    if (tl) {
      tl.innerHTML = title;
    } else {
      tl = document.createElement('H1');
      tl.className = 'title';
      tl.innerHTML = title;
      let cont = this.element.getElementsByClassName('toolbar-actions')[0];
      if (cont) {
        this.element.insertBefore(tl, cont);
      } else {
        this.element.appendChild(tl);
      }
    }
  }

  addProgressBar() {
    this.progressBar = new ProgressBar(this.element);
  }
}



class Footer extends ToggleElement {
  constructor(element) {
    super(element);
  }
  addNotificationBar() {
    this.notificationBar = new ToggleElement(document.createElement('DIV'));
    this.notificationBar.element.className = 'pull-right';
    this.notificationBar.message = document.createElement('STRONG');
    this.notificationBar.element.appendChild(this.notificationBar.message);
    this.element.appendChild(this.notificationBar.element);
  }

  addProgressBar() {
    this.progressBar = new ProgressBar(this.element);
  }
}



class Gui extends EventEmitter {
  constructor() {
    super();
    let header = document.getElementsByClassName("toolbar-header")[0];
    header.id = "header";
    this.win = require('electron').remote.getCurrentWindow();
    this.container = new ToggleElement(document.getElementsByClassName("window-content")[0]);
    this.header = new Header(header);
    let footer = document.getElementsByClassName("toolbar-footer")[0];
    footer.id = "footer";
    this.footer = new Footer(footer);
    this.footer.addProgressBar();
    this.footer.addNotificationBar();
    this._menuItems = [];
    this._menu = new Menu();
    Menu.setApplicationMenu(this._menu);
  }

  viewTrick() { //force the element to be arranged properly, fix some problem with leaflet's map
    let size = this.win.getSize();
    this.win.setSize(size[0] + 1, size[1] + 1);
    this.win.setSize(size[0], size[1]);
    //fix for windows behaviour, in linux is ok
  }


  notify(message) {
    this.footer.notificationBar.message.innerHTML = message;
  }

  setProgress(prog) {
    this.stopWaiting();
    this.footer.progressBar.setBar(prog);
  }

  startWaiting() {
    this.footer.progressBar.startWaiting();
  }

  stopWaiting() {
    this.footer.progressBar.stopWaiting();
  }

  reloadMenu() {
    this._menu = new Menu();
    this._menuItems.map((item) => {
      this._menu.append(item);
    });
    Menu.setApplicationMenu(this._menu);
  }

  addMenuItem(item) {
    if (item) {
      this._menu.append(item);
      this._menuItems.push(item);
      Menu.setApplicationMenu(this._menu);
      return (this._menuItems.length - 1);
    } else {
      return -1;
    }
  }

  removeMenuItem(item) {
    let idx = -1;
    if (item >= 0) {
      idx = item;
    } else {
      let idx = this._menuItems.indexOf(item);
    }
    if (idx < 0) return;
    this._menuItems.splice(idx, 1);
    this.reloadMenu();
  }

  updateMenuItem(idx, item) {
    if (item && (idx >= 0) && (idx < this._menuItems.length)) {
      this._menuItems[idx] = item;
      this.reloadMenu();
    }
  }

  openChildWindow(url, options) {
    options = options || {};
    let size = this.win.getSize();
    options.parent = this.win
    let child = new BrowserWindow(options);
    child.once('ready-to-show', () => {
      child.show()
    });
    // let bounds = this.win.getBounds();
    // let conb = this.container.element.getBoundingClientRect();
    // child.setBounds({
    //   x: bounds.x + 0,
    //   y: bounds.y + 30,
    //   width: bounds.width,
    //   height: bounds.height
    // });
    // this.win.on('move',()=>{
    //   let bounds = this.win.getBounds();
    //   child.setBounds({
    //     x: bounds.x + 0,
    //     y: bounds.y + 40,
    //     width: bounds.width,
    //     height: 600
    //   });
    // });
    child.loadURL(url);
    return child;
  }


} //end class definition




module.exports = Gui;
