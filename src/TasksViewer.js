// Copyright (c) 2016 Mario Juez (mjuez@fi.upm.es)
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



class TasksViewer extends GuiExtension {

    constructor(gui) {
        super(gui,{
            icon: icon
        });
    }

    activate() {

        this.addToggleButton({
            id: toggleButtonId,
            buttonsContainer: this.gui.header.actionsContainer,
            className: 'btn btn-default',
            groupClassName: 'pull-right',
            groupId: 'tasksPage',
            icon: icon
        });

        this.toggleButton = this.buttonsContainer.buttons[`${toggleButtonId}`];
        this.progressBar = new ProgressBar(this.toggleButton);
        this.progressBar.setHeight(4);

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
            this.gui.setProgress(p);
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
