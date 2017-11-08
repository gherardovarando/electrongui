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
    require('./src/ButtonsContainer.js')
  },
  get ExtensionsManager() {
    require('./src/ExtensionsManager.js')
  },
  get FolderSelector() {
    require('./src/FolderSelector.js')
  },
  get Grid() {
    require('./src/Grid.js')
  },
  get Gui() {
    require('./src/Gui.js')
  },
  get GuiExtension() {
    require('./src/GuiExtension.js')
  },
  get input() {
    require('./src/input')
  },
  get ListGroup() {
    require('./src/ListGroup.js')
  },
  get Modal() {
    require('./src/Modal.js')
  },
  get NavGroup() {
    require('./src/NavGroup.js')
  },
  get ProgressBar() {
    require('./src/ProgressBar.js')
  },
  get Sidebar() {
    require('./src/Sidebar.js')
  },
  get SplitPane() {
    require('./src/SplitPane.js')
  },
  get TabGroup() {
    require('./src/TabGroup.js')
  },
  get Table() {
    require('./src/Table.js')
  },
  get Task() {
    require('./src/Task.js')
  },
  get TaskManager() {
    require('./src/TaskManager.js')
  },
  get TasksViewer() {
    require('./src/TasksViewer.js')
  },
  get ToggleElement() {
    require('./src/ToggleElement.js')
  },
  get TreeList() {
    require('./src/TreeList.js')
  },
  get util() {
    require('./src/util.js')
  },
  get Workspace() {
    require('./src/Workspace.js')
  },
  get colors() {
    require('./src/Colors.js')
  },
  get Header() {
    require('./src/Header')
  },
  get Footer() {
    require('./src/Footer')
  },
  get Alert() {
    require('./src/Alert')
  }
}

module.export = eg
