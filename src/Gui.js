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

const EventEmitter = require('events')
const AlertManager = require('./AlertManager')
const ProgressBar = require('./ProgressBar')
const fs = require('fs')
const {
  Menu,
  MenuItem,
  BrowserWindow
} = require('electron').remote
const ToggleElement = require('./ToggleElement')
const ButtonsContainer = require('./ButtonsContainer')
const TaskManager = require('./TaskManager')
const ExtensionsManager = require('./ExtensionsManager')
const Workspace = require('./Workspace')
const util = require('./util')
const Header = require('./Header')
const Footer = require('./Footer')

class Gui extends EventEmitter {
  constructor(options) {
    options = options || {}
    util.insertCSS(require(path.join(__dirname, 'style', 'gui.css')))
    super()
    this._EGTYPE = ['gui']
    this.win = require('electron').remote.getCurrentWindow()
    let ap = util.div('window app')
    this.header = new Header(util.div("toolbar toolbar-header"), ap)
    this.container = new ToggleElement(util.div("window-content"))
    this.container.appendTo(ap)
    this.footer = new Footer(util.div("toolbar toolbar-footer"), ap)
    this.footer.addNotificationBar()

    this._menuItems = []
    this._menu = new Menu()
    this.taskManager = new TaskManager()
    this.extensions = new ExtensionsManager(this)
    this.workspace = new Workspace(options.workspace)
    this.tasks = this.taskManager
    this.alerts = new AlertManager(5)
    util.body.appendChild(ap)
  }

  static is(x){
    if (x && x._EGTYPE && Array.isArray(x._EGTYPE) && x._EGTYPE.includes('gui')) return true
    return false
  }


  viewTrick() { //force the element to be arranged properly, fix some problem with leaflet's map
    let size = this.win.getSize()
    this.win.setSize(size[0] + 1, size[1] + 1)
    this.win.setSize(size[0], size[1])
    //fix for windows behaviour, in linux is ok, if window is not maximise
  }



  notify(body, status) { //dont use it, use gui.alerts.add instead
    if (this.alerts instanceof AlertManager) {
      this.alerts.add(body, status || 'default')
    }
  }


  reloadMenu() {
    this._menu = new Menu()
    this._menuItems.map((item) => {
      this._menu.append(item)
    })
    Menu.setApplicationMenu(this._menu)
    return this
  }

  addMenuItem(item) {
    if (item) {
      this._menu.append(item)
      this._menuItems.push(item)
      Menu.setApplicationMenu(this._menu)
      return (this._menuItems.length - 1)
    } else {
      return -1
    }
    return this
  }

  removeMenuItem(item) {
    let idx = -1
    if (item >= 0) {
      idx = item
    } else {
      let idx = this._menuItems.indexOf(item)
    }
    if (idx < 0) return
    this._menuItems.splice(idx, 1)
    this.reloadMenu()
    return this
  }

  updateMenuItem(idx, item) {
    if (item && (idx >= 0) && (idx < this._menuItems.length)) {
      this._menuItems[idx] = item
      this.reloadMenu()
    }
    return this
  }

  openChildWindow(url, options) {
    options = options || {}
    let size = this.win.getSize()
    options.parent = this.win
    let child = new BrowserWindow(options)
    child.once('ready-to-show', () => {
      child.show()
    })
    child.loadURL(url)
    return child
  }


} //end class definition




module.exports = Gui
