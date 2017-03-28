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

"use strict";

const Sidebar = require('./Sidebar.js');
const GuiExtension = require('./GuiExtension.js');
const ToggleElement = require('./ToggleElement.js');
const Table = require('./Table.js');
const taskManager = require('./TaskManager.js');
const Task = require('./Task.js');
const util = require('./util.js');
const ProgressBar = require('./ProgressBar.js');


const icon = "fa fa-tasks";
const toggleButtonId = 'tasksPageToggleButton';

const gui = require('./gui.js');


class TasksViewer extends GuiExtension {

    constructor() {
        super({
            icon: icon
        });
    }

    activate() {

        this.addToggleButton({
            id: toggleButtonId,
            buttonsContainer: gui.header.actionsContainer,
            className: 'btn btn-default',
            groupClassName: 'pull-right',
            groupId: 'tasksPage',
            icon: icon
        });

        this.toggleButton = this.buttonsContainer.buttons[`${toggleButtonId}`];
        this.progressBar = new ProgressBar(this.toggleButton);
        this.progressBar.setHeight(3);

        this.addPane();
        this.appendChild(this.pane);

        this.taskManagerChangeListener = (...args) => {
            if (args.length === 1) {
                let taskId = args[0];
                let task = taskManager.tasks[taskId].task;
                let domElement = taskManager.tasks[taskId].domElement.element;

                if (task.status === Task.Status.RUNNING || task.status === Task.Status.CREATED) {
                    if (!this.runningTasksContainer.contains(domElement)) {
                        this.runningTasksContainer.insertBefore(domElement, this.runningTasksContainer.firstChild);
                    }
                } else {
                    if (this.runningTasksContainer.contains(domElement)) {
                        this.runningTasksContainer.removeChild(domElement);
                    }
                    if (!this.finishedTasksContainer.contains(domElement)) {
                        this.finishedTasksContainer.insertBefore(domElement, this.finishedTasksContainer.firstChild);
                    }
                }
            }
        };

        this.taskRemovedListener = (...args) => {
            if (args.length === 1) {
                let domElement = args[0].element;
                if (this.finishedTasksContainer.contains(domElement)) {
                    this.finishedTasksContainer.removeChild(domElement);
                }
            }
        };
        taskManager.on("change", this.taskManagerChangeListener);
        taskManager.on("task.removed", this.taskRemovedListener);


        taskManager.on("progress", (p) => {
            gui.setProgress(p);
            util.setProgress(p);
            this.progressBar.setBar(p);
        });

        super.activate();

    }

    deactivate() {
        this.element.removeChild(this.pane.element);
        this.removeToggleButton(toggleButtonId);
        taskManager.removeListener("change", this.taskManagerChangeListener);
        taskManager.removeListener("task.removed", this.taskRemovedListener);
        super.deactivate();
    }

    show() {
        super.show();
    }

    addPane() {
        this.pane = new ToggleElement(util.div('pane tasks-pane'));
        this.addSections();
        this.pane.show();
    }

    addSections() {
        let leftContainer = util.div('left-container');
        let rightContainer = util.div('right-container');
        let runningTasksHeader = util.div('tasks-header','Running tasks');
        let finishedTasksHeader = util.div('tasks-header','Finished tasks');
        this.runningTasksContainer = util.div('running-tasks-container');
        this.finishedTasksContainer = util.div('running-tasks-container');
        leftContainer.appendChild(runningTasksHeader);
        leftContainer.appendChild(this.runningTasksContainer);
        rightContainer.appendChild(finishedTasksHeader);
        rightContainer.appendChild(this.finishedTasksContainer);
        this.pane.element.appendChild(leftContainer);
        this.pane.element.appendChild(rightContainer);
    }

}

module.exports = TasksViewer;