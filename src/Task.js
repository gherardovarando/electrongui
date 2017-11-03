// Copyright (c) 2016 Mario Juez (mjuez@fi.upm.es) Gherardo Varando (gherardo.varando@gmail.com)
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

const {
  MenuItem,
  dialog
} = require('electron').remote
const EventEmitter = require('events')
const Modal = require('./Modal.js')
const Grid = require('./Grid.js')
const ButtonsContainer = require('./ButtonsContainer.js')
const ProgressBar = require('./ProgressBar.js')
const input = require('./input.js')
const dateFormat = require('dateformat')
const util = require('./util.js')

/**
 * Class representing a task.
 * @class Task
 * @extends {EventEmitter}
 */
class Task extends EventEmitter {

  /**
   * Creates a Task.
   *
   * @param {string} name - Task name.
   * @param {string} details - Task details.
   */
  constructor(name, details) {
    super()
    this._EGTYPE = ['task']
    this.id = null
    this.name = name
    this.details = details
    this.status = Task.Status.CREATED
    this.progress = 0
    this.startTime = null
    this.finishTime = null
    this.customAction = {}
  }

  static is(x){
    if (x && x._EGTYPE && Array.isArray(x._EGTYPE) && x._EGTYPE.includes('task')) return true
    return false
  }

  /**
   * Runs the task. A task can be executed only once, after being created.
   *
   * @return {boolean} If status changed.
   */
  run() {
    if (this.status === Task.Status.CREATED) {
      this.startTime = new Date()
      this.status = Task.Status.RUNNING
      this.emit("run")
      return true
    }
    return false
  }

  /**
   * Updates task status to COMPLETED if the task
   * is currently running.
   *
   * @return {boolean} If status changed.
   */
  success() {
    if (this.status === Task.Status.RUNNING) {
      this.finishTime = new Date()
      this.status = Task.Status.COMPLETED
      this.updateProgress(100)
      this.emit("success")
      return true
    }
    return false
  }


  error(message) {
    this.emit('error', {
      error: message
    })
  }

  /**
   * Updates task status to FAILED if the task
   * is currently running.
   *
   * @param {string} message - Failure information.
   * @return {boolean} If status changed.
   */
  fail(message) {
    if (this.status === Task.Status.RUNNING) {
      this.finishTime = new Date()
      this.status = Task.Status.FAILED
      this.failureInfo = message
      this.emit('fail', {
        error: message
      })
      return true
    }
    return false
  }

  /**
   * Updates task status to CANCELLED if the task
   * is currently running.
   *
   * @return {boolean} If status changed.
   */
  cancel() {
    if (this.status === Task.Status.RUNNING) {
      this.finishTime = new Date()
      this.status = Task.Status.CANCELLED
      this.emit("cancel")
      return true
    }
    return false
  }

  /**
   * Updates task progress if the task is currently running.
   *
   * @param {number} newProgress - new progress (between 0 and 100).
   */
  updateProgress(newProgress) {
    if (this.status === Task.Status.RUNNING) {
      if (newProgress <= 100) {
        this.progress = newProgress
      } else {
        this.progress = 100
      }

    } else {
      this.progress = 100
    }
    this.emit("progress")
  }


  estimateFinishTime() {
    if (this.startTime) {
      let p = this.progress
      let t = (new Date()) - this.startTime
      return ((100 - p) * t / p)
    } else {
      return NaN
    }

  }


}

/**
 * Task statuses enum.
 */
Task.Status = {
  CREATED: 0,
  RUNNING: 1,
  COMPLETED: 2,
  CANCELLED: 3,
  FAILED: 4
}

/**
 * Task DOM Element.
 */
Task.TaskDOMElement = class {

  /**
   * Creates a DOM element for a Task.
   *
   * @param {Task} task - task that will be represented in DOM.
   */
  constructor(task) {
    let format = "mm/dd/yy HH:MM:ss"

    this.task = task

    let openDetails = () => {
      if (this.additionalInfoContainer.classList.contains("open")) {
        this.additionalInfoContainer.classList.remove("open")
      } else {
        this.additionalInfoContainer.classList.add("open")
      }
    }

    this.element = util.div('task-container')
    this.mainInfoContainer = util.div('main-info-container')

    this.statusIconContainer = util.div('status-icon-container')
    this.statusIconContainer.onclick = openDetails
    this.statusIcon = document.createElement("I")
    this.statusIconContainer.appendChild(this.statusIcon)
    this.mainInfoContainer.appendChild(this.statusIconContainer)

    this.middleContainer = util.div('middle-container')
    this.middleContainer.onclick = openDetails

    this.taskDataTableContainer = util.div('task-data-table-container')
    this.taskDataContainer = util.div('task-data-container')
    this.nameContainer = util.div('name-container', task.name)
    this.taskDataContainer.appendChild(this.nameContainer)

    this.detailsContainer = util.div('details-container', task.details)
    this.taskDataContainer.appendChild(this.detailsContainer)
    this.taskDataTableContainer.appendChild(this.taskDataContainer)



    this.actionButtonContainer = util.div('action-button-container')
    this.taskDataTableContainer.appendChild(this.actionButtonContainer)
    this.middleContainer.appendChild(this.taskDataTableContainer)

    this.progressBar = new ProgressBar(this.middleContainer)
    this.progressBar.startWaiting()
    this.mainInfoContainer.appendChild(this.middleContainer)

    this.cancelContainer = document.createElement("DIV")
    this.cancelContainer.className = "cancel-container"
    this.btnCancel = util.icon('fa fa-times-circle  danger')
    this.btnCancel.onclick = () => {
      dialog.showMessageBox({
        title: 'Warning!',
        type: 'warning',
        buttons: ['No', "Yes"],
        message: `This action cannot be undone. Continue?`,
        noLink: true
      }, (id) => {
        if (id > 0) {
          if (!this.task.cancel()) {
            this.task.emit("remove")
          }
        }
      })
    }
    this.cancelContainer.appendChild(this.btnCancel)
    this.mainInfoContainer.appendChild(this.cancelContainer)
    this.mainInfoContainer.appendChild(util.icon(task.icon || ''))
    this.element.appendChild(this.mainInfoContainer)

    this.additionalInfoContainer = document.createElement("DIV")
    this.additionalInfoContainer.className = "additional-info-container"
    this.additionalInfoGrid = new Grid(8, 1)
    this.statusElement = util.div('')
    this.additionalInfoGrid.addElement(this.statusElement)
    this.failureInfoElement = util.div('')
    this.additionalInfoGrid.addElement(this.failureInfoElement)

    this.startTimeContainer = util.div('')
    this.startTimeContainer.innerHTML = `<strong>Started on: </strong>${dateFormat(this.task.startTime, format)}`
    this.addAditionalInformation(this.startTimeContainer)

    this.finishTimeContainer = util.div('cell')
    this.finishTimeContainer.innerHTML = `<strong>Expeted finish on: </strong> ??`
    this.addAditionalInformation(this.finishTimeContainer)

    this.additionalInfoContainer.appendChild(this.additionalInfoGrid.element)
    this.element.appendChild(this.additionalInfoContainer)

    this._configureByStatus()
    this._bindEventListeners()
  }

  /**
   * Configures DOM element visualization by current task status.
   * - A task with CREATED status will show cogs icon.
   * - A task with RUNNING status will show a spinning circle.
   * - A task with COMPLETED status will show a green tick.
   * - A task with FAILED status will show a red exclamation and failure info message.
   * - A task with CANCELLED status will show a red exclamation.
   */
  _configureByStatus() {
    this.statusElement.display = 'none'
    //this.statusElement.innerHTML = ''
    switch (this.task.status) {
      case Task.Status.CREATED:
        //this.statusElement.innerHTML += "CREATED"
        this.statusIcon.className = "fa fa-circle-o-notch"
        break
      case Task.Status.RUNNING:
        //this.statusElement.innerHTML += "RUNNING"
        this.statusIcon.className = "fa fa-circle-o-notch fa-spin"
        break
      case Task.Status.COMPLETED:
        //this.statusElement.innerHTML += "COMPLETED"
        this.statusIcon.className = "fa fa-check-square-o completed"
        break
      case Task.Status.FAILED:
        //this.statusElement.innerHTML += "FAILED"
        this.failureInfoElement.innerHTML = this.task.failureInfo
        this.statusIcon.className = "fa fa-exclamation-triangle wrong"
        break
      case Task.Status.CANCELLED:
        //this.statusElement.innerHTML += "CANCELLED"
        this.statusIcon.className = "fa fa-exclamation-triangle wrong"
        break
    }
  }

  /**
   * Adds additional information to the additional information table (2x4).
   *
   * @param {HTMLElement} additionalInformation - a DOM element.
   */
  addAditionalInformation(additionalInformation) {
    this.additionalInfoGrid.addElement(additionalInformation)
  }

  /**
   * Adds and shows the action button.
   * The action button should appear when the task finishes.
   */
  _addActionButton() {
    let actionButton = document.createElement("BUTTON")
    actionButton.innerHTML = this.task.customAction["caption"]
    actionButton.className = "btn btn-positive"
    actionButton.onclick = this.task.customAction["onclick"]
    //this.actionButtonContainer.appendChild(actionButton)
  }

  /**
   * Bind event listeners to the task.
   * - When run event is fired, adds start time additional information.
   * - When success event is fired, adds finish time additional information and action button.
   * - When fail event is fired, adds fail time additional information.
   * - When cancel event is fired, adds cancel time additional information.
   * - When progress event is fired, progress bar is updated.
   */
  _bindEventListeners() {
    let format = "mm/dd/yy HH:MM:ss"
    let form = "dd HH:MM:ss"

    this.task.on("run", () => {
      this._configureByStatus()
      this.startTimeContainer.innerHTML = `<strong>Started on: </strong>${dateFormat(this.task.startTime, format)}`
    })

    this.task.on("success", () => {
      this._configureByStatus()
      this.progressBar.stopWaiting()
      this.progressBar.setBar(100)
      this.finishTimeContainer.innerHTML = `<strong>Finished on: </strong>${dateFormat(this.task.finishTime, format)}`
      if (Object.keys(this.task.customAction).length > 0) {
        this._addActionButton()
      }
    })

    this.task.on("fail", () => {
      this._configureByStatus()
      this.progressBar.stopWaiting()
      this.finishTimeContainer.innerHTML = `<strong>Failed on: </strong>${dateFormat(this.task.finishTime, format)}`
    })

    this.task.on("cancel", () => {
      this._configureByStatus()
      this.progressBar.stopWaiting()
      this.finishTimeContainer.innerHTML = `<strong> Cancelled on: </strong>${dateFormat(this.task.finishTime, format)}`
    })

    this.task.on("progress", () => {
      this.progressBar.stopWaiting()
      this.progressBar.setBar(this.task.progress)
      this.finishTimeContainer.innerHTML = `<strong>Expeted finish in: </strong>${util.parseTimeInterval(this.task.estimateFinishTime())}`
    })
  }

}



module.exports = Task
