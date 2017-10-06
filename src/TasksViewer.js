// Copyright (c) 2016 Mario Juez (mjuez@fi.upm.es), Gherardo Varando (gherardo.varando@gmail.com)
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

const Sidebar = require('./Sidebar.js')
const GuiExtension = require('./GuiExtension.js')
const ToggleElement = require('./ToggleElement.js')
const Table = require('./Table.js')
const TaskManager = require('./TaskManager.js')
const Task = require('./Task.js')
const util = require('./util.js')
const ProgressBar = require('./ProgressBar.js')
const Modal = require('./Modal')
const ButtonsContainer = require('./ButtonsContainer')


const icon = "fa fa-tasks"
const toggleButtonId = 'tasksPageToggleButton'

class TasksViewer extends GuiExtension {

  constructor(gui) {
    super(gui, {
      icon: icon
    })
  }

  activate() {

    this.addToggleButton({
      id: toggleButtonId,
      buttonsContainer: this.gui.header.actionsContainer,
      className: 'btn btn-default',
      groupClassName: 'pull-right',
      groupId: 'tasksPage',
      icon: icon
    })
    this.buttonsContainer.buttons[toggleButtonId].onclick = () => {
      this.modal.toggle()
    }

    this.on('show', () => {
      this.modal.hide()
    })

    this.toggleButton = this.buttonsContainer.buttons[`${toggleButtonId}`]
    this.progressBar = new ProgressBar(this.toggleButton)
    this.progressBar.setHeight(4)
    this.gui.container.element.addEventListener('click',()=>{
      this.modal.hide()
    })

    this.addPane()

    this.taskManagerChangeListener = (...args) => {
      if (args.length === 1) {
        let taskId = args[0]
        let task = this.gui.taskManager.tasks[taskId].task
        let domElement = this.gui.taskManager.tasks[taskId].domElement.element

        if (task.status === Task.Status.RUNNING || task.status === Task.Status.CREATED) {
          if (!this.runningTasksContainer.contains(domElement)) {
            this.runningTasksContainer.insertBefore(domElement, this.runningTasksContainer.firstChild)
          }
        } else {
          if (this.runningTasksContainer.contains(domElement)) {
            this.runningTasksContainer.removeChild(domElement)
          }
          if (!this.finishedTasksContainer.contains(domElement)) {
            this.finishedTasksContainer.insertBefore(domElement, this.finishedTasksContainer.firstChild)
          }
        }
      }
    }

    this.taskRemovedListener = (...args) => {
      if (args.length === 1) {
        let domElement = args[0].element
        if (this.finishedTasksContainer.contains(domElement)) {
          this.finishedTasksContainer.removeChild(domElement)
        }
      }
    }
    this.gui.taskManager.on("change", this.taskManagerChangeListener)
    this.gui.taskManager.on("task.removed", this.taskRemovedListener)


    this.gui.taskManager.on("progress", (p) => {
      util.setProgress(p)
      this.progressBar.setBar(p)
    })

    this.modal = new Modal({
      permanent: true,
      title: '',
      body: this.pane.element,
      height: 'auto',
      width: '100%',
      basewidth: '300px',
      baseheight: 'auto',
      baseleft: 'auto',
      basebottom: 'auto',
      baseright: '0',
      parent: this.gui.container,
      backgroundcolor: 'rgba(0,0,0,0)'
    })

    this.element.classList.add('pane-group')



    let footer = util.div('toolbar toolbar-footer')
    let btns = util.div('toolbar-actions')
    footer.id = 'modalfootertaskviewer'
    let bc = new ButtonsContainer(btns)
    this.modalBar = new ProgressBar(footer)
    bc.addButton({
      text: '',
      icon: 'fa fa-ban',
      className: 'btn btn-negative',
      action: ()=>{
         this.gui.taskManager.cancelAllTasks()
         this.progressBar.setBar(0)
      },
      groupId: 'groupfootermodaltask',
      groupClassName: 'btn-group'
    })
    bc.addButton({
      text: '',
      icon: 'fa fa-trash',
      className: 'btn btn-default',
      action: ()=>{
         util.empty(this.finishedTasksContainer,this.finishedTasksContainer.firstChild)
      },
      groupId: 'groupfootermodaltask',
      groupClassName: 'btn-group'
    })
    footer.appendChild(btns)
    this.modal.addFooter(footer)


    super.activate()

  }

  deactivate() {
    this.modal.destroy()
    this.removeToggleButton(toggleButtonId)
    this.gui.taskManager.removeListener("change", this.taskManagerChangeListener)
    this.gui.taskManager.removeListener("task.removed", this.taskRemovedListener)
    super.deactivate()
  }


  addPane() {
    this.pane = new ToggleElement(util.div('pane tasks-pane'))
    this.pane.element.style.width = '100%'
    this.pane.element.style.overflow='auto'
    this.addSections()

  }

  addSections() {
    this.runningTasksContainer = util.div('running-tasks-container')
    this.finishedTasksContainer = util.div('running-tasks-container')

    this.pane.appendChild(util.div('tasks-header', 'Running'))
    this.pane.appendChild(this.runningTasksContainer)
    this.pane.appendChild(util.div('tasks-header', 'Finished'))
    this.pane.appendChild(this.finishedTasksContainer)
  }

}

module.exports = TasksViewer
