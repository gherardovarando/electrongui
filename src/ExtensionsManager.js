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

"use strict"
const {
  Menu,
  MenuItem,
  dialog,
  app
} = require('electron').remote
const fs = require('fs')
const path = require('path')
const GuiExtension = require('./GuiExtension')
const Sidebar = require('./Sidebar.js')
const ToggleElement = require('./ToggleElement.js')
const util = require('./util.js')
const {
  spawn
} = require('child_process')


class ExtensionsManager extends GuiExtension {

  constructor(gui) {
    super(gui, {
      menuLabel: 'Extensions',
      menuTemplate: [{
        label: 'Manager',
        click: () => {
          this.show()
        }
      }, {
        label: 'Install Extension',
        click: () => {
          dialog.showOpenDialog({
            title: 'Select the extension main .js file or the relative package.json',
            buttonlabel: 'Install',
            filters: [{
                name: 'javascript',
                extensions: ['js', 'JS']
              },
              {
                name: 'package json',
                extensions: ['json', 'JSON']
              }
            ],
            openDirectory: false,
            openFile: true
          }, (filePaths, err) => {
            if (err) {
              this.emit('error', err)
              return
            }
            if (!filePaths) return
            let p = filePaths[0]
            this.load(p, (ext) => {
              if (ext) {
                ext.info.manuallyinstalled = true
              }
            })
          })
        }
      }, {
        type: 'separator'
      }]
    })
    this.localFolder = app.getPath('appData')
    this.extensions = {}
    this.sidebar = new Sidebar(this.element)
    this.sidebar.addList('list')
    this.sidebar.show()
    //this.sidebar.hide()
    this.sidebar.list.addSearch({
      placeholder: 'Search extension'
    })

    //here put actions to load a new extension from custom file.
    this.pane = new ToggleElement(document.createElement('DIV'))
    this.appendChild(this.pane)
    this.gui.on('load:extension', (e) => {
      this.add(e.extension)
    })
  }

  activate() {
    this.appendMenu()
    super.activate()
  }


  install(name) {

    if (typeof name === 'string') {
      this.download(name, (pth, err) => {
        if (err) {
          this.gui.alerts.add(`Unable to install ${name} \n ${err.message}`)
        } else {
          this.load(pth, (ext) => {
            if (GuiExtension.is(ext)) this.gui.alerts.add(`Extension ${name} installed and loaded`, 'success')
          })
        }
      })
    }


  }

  download(name, cl) {
    let alert = this.gui.alerts.add(`Downloading ${name}`, 'progress')
    let ch = spawn('npm', ['install', name], {
      cwd: this.localFolder
    })
    ch.on('close', (code) => {
      alert.remove()
      if (code === 0) {
        cl(path.join(this.localFolder, 'node_modules', name))
      } else {
        cl(null, new Error(`Error on npm install ${name}. ${name} must be a valid npm module`))
      }
    })
  }


  load(extPath, cl) {
    let ext
    if (typeof extPath === 'string') {
      try {
        delete require.cache[extPath]
        let tmp = require(extPath)
        if (tmp) {
          ext = new tmp(this.gui)
        } else {}
      } catch (e) {
        this.emit('error', new Error(`Error loading extension from ${extPath}, details: ${e.message}`))
        return
      }
    } else {
      this.emit('error', new Error(`trying to load non path extension from ${extPath}`))
      return
    }
    if (typeof cl === 'function') {
      cl(ext)
    }
  }


  hideExtensions() {
    Object.keys(this.extensions).map((name) => {
      this.extensions[name].hide()
    })
    this.hide()
  }



  add(extension) {
    if (this.extensions[extension.constructor.name]) {
      this.extensions[extension.constructor.name].deactivate()
      this.sidebar.list.removeItem(extension.constructor.name)
      this.extensions[extension.constructor.name].removeAllListeners()
      this.removeMenuItem(this.extensions[extension.constructor.name]._extMenuIdx)
      delete this.extensions[extension.constructor.name]
    }
    this.extensions[extension.constructor.name] = extension
    let menuitem = new MenuItem({
      label: extension.constructor.name,
      type: 'checkbox',
      click: (item) => {
        if (item.checked) {
          extension.activate()
        } else {
          extension.deactivate()
        }
      }
    })
    extension._extMenuIdx = this.addMenuItem(menuitem)
    this.sidebar.addItem({
      id: extension.constructor.name,
      icon: `${extension.icon} fa-2x`,
      image: extension.image,
      title: extension.constructor.name,
      toggle: true,
      active: extension.active,
      onmouseover: () => {
        this.pane.clear()
        if (extension.info) {
          this.pane.appendChild(util.div('padded', `Author: ${extension.info.author}`))
          this.pane.appendChild(util.div('padded', extension.info.note))
          if (extension.info.manuallyinstalled) {
            this.pane.appendChild(util.div('cell', 'Manually installed'))
          }
        }
        this.pane.show()
      },
      onclick: {
        active: () => {
          extension.activate()
        },
        deactive: () => {
          extension.deactivate()
        }
      },
      oncontextmenu: () => {}
    })

    extension.on('deactivate', () => {
      this.sidebar.list.deactiveItem(extension.constructor.name)
      menuitem.checked = false
    })

    extension.on('activate', () => {
      this.sidebar.list.activeItem(extension.constructor.name)
      menuitem.checked = true
    })

    extension.on('show', () => {
      //gui.viewTrick()
      this.hide() //hide the extensions manager
      //and all the other extensions:
      Object.keys(this.extensions).map((k) => {
        if (this.extensions[k] != extension) {
          this.extensions[k].hide()
        }
      })
    })

    this.emit('add', extension)

  }

  show() {
    this.hideExtensions()
    this.sidebar.show()
    super.show()
  }


  hide() {
    if (Object.keys(this.extensions).every((key) => {
        this.extensions[key].isHidden()
      }) && this.isHidden()) {}
    super.hide()
  }






}

module.exports = ExtensionsManager
