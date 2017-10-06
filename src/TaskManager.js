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
'use strict'

const Task = require('./Task.js')
const EventEmitter = require('events')
const util = require('./util')

/**
 * TaskManager.js
 *
 * @class TaskManager
 * @extends {EventEmitter}
 */
class TaskManager extends EventEmitter {

  /**
   * Creates TaskManager instance or returns it if already exists.
   *
   * @return {TaskManager} singleton instance.
   */
  constructor() {
    super()
    this.numTasks = 0
    this.nextId = 0
    this.tasks = {}
    window.addEventListener('beforeunload', (e) => {
      this.cancelAllTasks()
    })
  }

  /**
   * Adds a task to manage it.
   * When a task is added, task manager change event is fired.
   *
   * @param {Task} task - a Task.
   * @return {boolean} If task was added successfully.
   */
  addTask(task) {
    if (task instanceof Task) {
      task.id = this.nextId
      this.tasks[task.id] = {
        task: task,
        domElement: new Task.TaskDOMElement(task)
      }
      this._bindEventListeners(task)
      this.numTasks += 1
      this.nextId += 1
      this.emit("change", task.id)
      return true
    }
    return false
  }

  /**
   * Removes a task from the manager given its id.
   *
   * @param {number} id - Task id.
   */
  removeTask(id) {
    this.tasks[id].id = null
    delete this.tasks[id]
    this.numTasks -= 1
  }

  /**
   * Cancel all running tasks of the manager.
   */
  cancelAllTasks() {
    if (this.numTasks > 0) {
      Object.keys(this.tasks).map((key) => {
        this.tasks[key].task.cancel()
      })
    }
  }

  /**
   * Bind all event listeners to task events.
   * When a task event is fired, task manager
   * change or task.removed event will be fired.
   *
   * @param {Task} task - Binding target task.
   */
  _bindEventListeners(task) {
    task.on("success", () => {
      this.emit("change", task.id)
    })

    task.on("fail", () => {
      this.emit("change", task.id)
    })

    task.on("cancel", () => {
      this.emit("change", task.id)
    })

    task.on("remove", () => {
      this.emit("task.removed", this.tasks[task.id].domElement)
      this.removeTask(task.id)
    })

    task.on("progress", () => {
      let progs = Object.keys(this.tasks).map((k) => {
        if (this.tasks[k].task.status > Task.Status.RUNNING) {
          return NaN
        } else {
          return this.tasks[k].task.progress
        }
      })
      this.emit("progress", util.mean(progs))
    })
  }
}

module.exports = TaskManager
