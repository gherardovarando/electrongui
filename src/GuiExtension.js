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

'use strict'

const ToggleElement = require('./ToggleElement.js')
const util = require('./util.js')
const {
  Menu,
  MenuItem
} = require('electron').remote

class GuiExtension extends ToggleElement {
  constructor(gui, config) {
    let element = document.createElement('DIV')
    element.className = 'pane-group'
    element.style.display = 'none' //hide by default
    super(element)
    this._EGTYPE.push('guiextension')
    config = Object.assign({
      icon: 'fa fa-cubes',
      menuLabel: this.constructor.name
    }, config)
    this.element.id = `${this.constructor.name}Pane`
    this.id = this.constructor.name
    this.icon = config.icon
    this.info = Object.assign({
      author: 'undefined',
      keyword: []
    }, config.info)
    this.image = config.image
    this.gui = gui
    this._menuIndx = -1
    this._menu = new Menu()
    if (config.menuTemplate) {
      this._menu = Menu.buildFromTemplate(config.menuTemplate)
    }
    this._menuItems = this._menu.items
    this._menuLabel = config.menuLabel
    this._menuItem = new MenuItem({
      label: this._menuLabel,
      type: 'submenu',
      submenu: this._menu
    })
    this.gui.emit('load:extension', {
      extension: this
    })
  }

  static is(x){
    if (x && x._EGTYPE && Array.isArray(x._EGTYPE) && x._EGTYPE.includes('guiextension')) return true
    return false
  }

  activate() {
    this.gui.container.appendChild(this.element)
    this.active = true
    this.emit('activate')
    return this
  }

  deactivate() {
    this.gui.container.removeChild(this.element)
    this.hide()
    this.clear()
    this.removeMenu()
    this.active = false
    this.emit('deactivate')
    return this
  }

  _buildMenuItem() {
    this._menu = new Menu()
    this._menuItems.map((item) => {
      this._menu.append(item)
    })
    this._menuItem = new MenuItem({
      label: this._menuLabel,
      type: 'submenu',
      submenu: this._menu
    })
  }

  setMenuLabel(label) {
    if (typeof label === 'string') {
      this._menuLabel = label
    }
  }


  addMenuItem(item) {
    if (item) {
      this._menuItems.push(item)
      this._buildMenuItem()
      this.gui.updateMenuItem(this._menuIndx, this._menuItem)
      return (this._menuItems.length - 1)
    }
    return (-1)
  }

  removeMenuItem(item) {
    if (item >= 0) {
      this._menuItems.splice(item, 1)
      this._buildMenuItem()
      this.gui.updateMenuItem(this._menuIndx, this._menuItem)
    } else if (item) {
      let idx = this._menuItems.indexOf(item)
      if (idx < 0) return
      this._menuItems.splice(idx, 1)
      this._buildMenuItem()
      this.gui.updateMenuItem(this._menuIndx, this._menuItem)
    }
  }

  appendMenu() {
    if (this._menuIndx >= 0) return false
    this._buildMenuItem()
    this._menuIndx = this.gui.addMenuItem(this._menuItem)
    return true
  }

  removeMenu() {
    this.gui.removeMenuItem(this._menuIndx)
    this._menuIndx = -1
  }

}

module.exports = GuiExtension
