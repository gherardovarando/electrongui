// Copyright (c) 2017 Gherardo Varando (gherardo.varando@gmail.com)
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

let eg = {
  get ButtonsContainer() {
    return require('./src/ButtonsContainer.js')
  },
  get ExtensionsManager() {
    return require('./src/ExtensionsManager.js')
  },
  get FolderSelector() {
    return require('./src/FolderSelector.js')
  },
  get Grid() {
    return require('./src/Grid.js')
  },
  get Gui() {
    return require('./src/Gui.js')
  },
  get GuiExtension() {
    return require('./src/GuiExtension.js')
  },
  get input() {
    return require('./src/input')
  },
  get ListGroup() {
    return require('./src/ListGroup.js')
  },
  get Modal() {
    return require('./src/Modal.js')
  },
  get NavGroup() {
    return require('./src/NavGroup.js')
  },
  get ProgressBar() {
    return require('./src/ProgressBar.js')
  },
  get Sidebar() {
    return require('./src/Sidebar.js')
  },
  get SplitPane() {
    return require('./src/SplitPane.js')
  },
  get TabGroup() {
    return require('./src/TabGroup.js')
  },
  get Table() {
    return require('./src/Table.js')
  },
  get Task() {
    return require('./src/Task.js')
  },
  get TaskManager() {
    return require('./src/TaskManager.js')
  },
  get TasksViewer() {
    return require('./src/TasksViewer.js')
  },
  get ToggleElement() {
    return require('./src/ToggleElement.js')
  },
  get TreeList() {
    return require('./src/TreeList.js')
  },
  get util() {
    return require('./src/util.js')
  },
  get Workspace() {
    return require('./src/Workspace.js')
  },
  get colors() {
    return require('./src/Colors.js')
  },
  get Header() {
    return require('./src/Header')
  },
  get Footer() {
    return require('./src/Footer')
  },
  get Alert() {
    return require('./src/Alert')
  }
}

module.export = eg
