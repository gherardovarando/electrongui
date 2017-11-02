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
const storage = require('electron-json-storage')
const fs = require('fs')
const {
  dialog
} = require('electron').remote
const util = require('./util.js')
const EventEmitter = require('events')

class Workspace extends EventEmitter {
  constructor(options) {
    super()
    options = options || {}
    this.options = options
    this.spaces = {
      workspace: {
        path: ''
      }
    }
    if (!this.options.clean) {
      storage.get('workspace', (error, data) => {
        if (error) {
          let err1 = new Error(`Error trying to recover workspace, details: ${error.message}`)
          this.emit('error', err1)
          return
        }
        if (data.workspace) {
          this.spaces = data || this.spaces
          this.emit('load', {
            path: 'recover'
          })
        }
      })
    }
    window.addEventListener('beforeunload', (e) => {
      storage.set('workspace', this.spaces, (error) => {})
    })
    let a = 0
    setInterval(() => {
      storage.set('workspace', this.spaces, (error) => {})
    }, options.syncinterval || 30000)
  }



  addSpace(extension, object, overwrite) {
    if (extension) {
      if (object) {
        if (!overwrite && this.spaces[extension]) return
        this.spaces[extension] = object
      } else {
        if (extension._space) {
          this.addSpace(extension, extension._space)
        }
      }
    }
  }

  getSpace(extension) {
    if (extension) {
      return this.spaces[extension]
    }
  }

  newWorkspace(path) {
    this.spaces = {
      workspace: {
        path: path || ''
      }
    }
    this.emit('load', {
      path: path
    })
  }

  reg() {
    storage.set('workspace', this.spaces, () => {})
  }

  safequit() {
    storage.set('workspace', this.spaces, (error) => {
      app.quit()
    })
  }

  removeSpace(extension) {
    delete this.spaces[extension]
  }

  new(path) {
    this.newWorkspace(path)
  }

  newChecking() {
    if (Object.keys(this.spaces).length < 2) {
      this.load()
      return
    }
    dialog.showMessageBox({
      title: 'Save workspace?',
      type: 'warning',
      buttons: ['Cancel', "Don't save", 'Save'],
      message: `Save the current workspace before creating a new one?`,
      detail: `Your changes will be lost if you do not save them`,
      noLink: true
    }, (id) => {
      if (id > 0) {
        if (id > 1) {
          this.save(this.spaces.workspace.path, () => {
            this.newWorkspace()
          })
        } else {
          this.newWorkspace()
        }
      }
    })
  }

  loadChecking() {
    dialog.showMessageBox({
      title: 'Save workspace?',
      type: 'warning',
      buttons: ['Cancel', "Don't save", 'Save'],
      message: `Save the current workspace before opening a new one?`,
      detail: `Your changes will be lost if you do not save them`,
      noLink: true
    }, (id) => {
      if (id > 0) {
        if (id > 1) {
          this.save(this.spaces.workspace.path, () => {
            this.load()
          })
        } else {
          this.load()
        }
      }
    })
  }


  save(path, cl, error) {
    let content = JSON.stringify(this.spaces)
    if (typeof path === 'string' && path != '') {
      this.spaces.workspace.path = path
      fs.writeFile(path, content, (err) => {
        if (err) {
          let err1 = new Error(`An error ocurred creating the file ${path}, error details  ${err.message}`)
          this.spaces.workspace.path = undefined
          if (typeof error === 'function') error(err1)
          this.emit('error', err1)
        }
        storage.set('workspace', this.spaces, () => {})
        this.emit('save', {
          path: path
        })
        if (typeof cl === 'function') {
          cl(path)
        }
      })
      return
    }
    dialog.showSaveDialog({
        title: 'Save the  current Workspace',
        filters: [{
          name: 'JSON',
          extensions: ['json']
        }]
      },
      (fileName) => {
        if (fileName === undefined) {
          let err = new Error('No filename provided')
          if (typeof error === 'function') error(err)
          this.emit('error', err)
        }
        this.spaces.workspace.path = fileName
        fs.writeFile(fileName, content, (err) => {
          if (err) {
            this.spaces.workspace.path = undefined
            err2 = new Error(`An error ocurred creating the file in ${filename}, error details:  ${err.message}`)
            this.emit('error', err2)
            if (typeof error === 'function') error(err2)
          }
          storage.set('workspace', this.spaces, () => {})
          this.emit('save', {
            path: fileName
          })
          if (typeof cl === 'function') {
            cl(fileName)
          }
        })
      })
  }


  load(path, cl, error) {
    if (typeof path === 'string' && path != '') {
      wk = util.readJSONsync(path)
      this.spaces = wk
      storage.set('workspace', this.spaces, () => {})
      this.spaces.workspace = {
        path: path || ''
      }
      this.emit('load', {
        path: path
      })
      return
    }
    dialog.showOpenDialog({
      title: "Load a Workspace",
      filters: [{
        name: 'JSON',
        extensions: ['json']
      }],
      properties: ['openFile']
    }, (file, err) => {
      if (err) {
        let err2 = new Error(`Error opening the workspace json file: ${err.message}`)
        this.emit('error', err)
        if (typeof error === 'function') error(err)
        return
      }
      let wk
      try {
        wk = util.readJSONsync(file[0])
      } catch (e) {
        let err3 = new Error(`Error parsing the workspace json string: ${e.message}`)
        this.emit('error', err3)
        if (typeof error === 'function') error(err3)
        return
      }
      try {
        this.spaces = wk
        this.spaces.workspace = {
          path: file[0]
        }
        this.emit('load', {
          path: file[0]
        })
        storage.set('workspace', this.spaces, () => {})
      } catch (e) {
        let err4 = new Error(`Error loading the workspace from file ${file[0]}, details: ${e.message}`)
        this.emit('error', err4)
        if (typeof error === 'function') {
          error(err4)
        }
      }
    })
  }


}


module.exports = Workspace
