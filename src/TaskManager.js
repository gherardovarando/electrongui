/**
 * @author : Mario Juez (mario@mjuez.com)
 *
 * @license: GPL v3
 *     This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

const Task = require('./Task.js');
const EventEmitter = require('events');
const util = require('./util');
let instance = null;

/**
 * TaskManager.js (Singleton).
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
        if (!instance) {
            super();
            this.numTasks = 0;
            this.nextId = 0;
            this.tasks = {};
            instance = this;
            window.addEventListener('beforeunload', (e) => {
                this.cancelAllTasks();
            });
        }
        return instance;
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
            task.id = this.nextId;
            this.tasks[task.id] = {
                task: task,
                domElement: new Task.TaskDOMElement(task)
            };
            this._bindEventListeners(task);
            this.numTasks += 1;
            this.nextId += 1;
            this.emit("change", task.id);
            return true;
        }
        return false;
    }

    /**
     * Removes a task from the manager given its id.
     *
     * @param {number} id - Task id.
     */
    removeTask(id) {
        this.tasks[id].id = null;
        delete this.tasks[id];
        this.numTasks -= 1;
    }

    /**
     * Cancel all running tasks of the manager.
     */
    cancelAllTasks() {
        if (this.numTasks > 0) {
            Object.keys(this.tasks).map((key) => {
                this.tasks[key].task.cancel();
            });
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
            this.emit("change", task.id);
        });

        task.on("fail", () => {
            this.emit("change", task.id);
        });

        task.on("cancel", () => {
            this.emit("change", task.id);
        });

        task.on("remove", () => {
            this.emit("task.removed", this.tasks[task.id].domElement);
            this.removeTask(task.id);
        });

        task.on("progress", () => {
            let progs = Object.keys(this.tasks).map((k) => {
                if (this.tasks[k].task.status > Task.Status.RUNNING) {
                    return NaN;
                }
                else{
                  return this.tasks[k].task.progress;
                }
            });
            this.emit("progress", util.mean(progs));
        });
    }
}

module.exports = new TaskManager();
