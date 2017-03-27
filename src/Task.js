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

const {
    MenuItem,
    dialog
} = require('electron').remote;
const EventEmitter = require('events');
const Modal = require('./Modal.js');
const Grid = require('./Grid.js');
const ButtonsContainer = require('./ButtonsContainer.js');
const ProgressBar = require('./ProgressBar.js');
const input = require('./input.js');
const dateFormat = require('dateformat');
const gui = require('./gui.js');
const util = require('./util.js');

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
        super();
        this.id = null;
        this.name = name;
        this.details = details;
        this.status = Task.Status.CREATED;
        this.progress = 0;
        this.startTime = null;
        this.finishTime = null;
        this.customAction = {};
    }

    /**
     * Runs the task. A task can be executed only once, after being created.
     *
     * @return {boolean} If status changed.
     */
    run() {
        if (this.status === Task.Status.CREATED) {
            this.startTime = new Date();
            this.status = Task.Status.RUNNING;
            this.emit("run");
            return true;
        }
        return false;
    }

    /**
     * Updates task status to COMPLETED if the task
     * is currently running.
     *
     * @return {boolean} If status changed.
     */
    success() {
        if (this.status === Task.Status.RUNNING) {
            this.finishTime = new Date();
            this.status = Task.Status.COMPLETED;
            this.updateProgress(100);
            this.emit("success");
            return true;
        }
        return false;
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
            this.finishTime = new Date();
            this.status = Task.Status.FAILED;
            this.failureInfo = message;
            console.log(message);
            this.emit("fail");
            return true;
        }
        return false;
    }

    /**
     * Updates task status to CANCELLED if the task
     * is currently running.
     *
     * @return {boolean} If status changed.
     */
    cancel() {
        if (this.status === Task.Status.RUNNING) {
            this.finishTime = new Date();
            this.status = Task.Status.CANCELLED;
            this.emit("cancel");
            return true;
        }
        return false;
    }

    /**
     * Updates task progress if the task is currently running.
     *
     * @param {number} newProgress - new progress (between 0 and 100).
     */
    updateProgress(newProgress) {
        if (this.status === Task.Status.RUNNING) {
            if (newProgress <= 100) {
                this.progress = newProgress;
            } else {
                this.progress = 100;
            }

        } else {
            this.progress = 100;
        }
        this.emit("progress");
    }


    estimateFinishTime() {
        if (this.startTime) {
            let p = this.progress;
            let t = (new Date()) - this.startTime;
            return ((100 - p) * t / p);
        } else {
            return NaN;
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
        let format = "mm/dd/yy HH:MM:ss";

        this.task = task;

        let openDetails = () => {
            if (this.additionalInfoContainer.classList.contains("open")) {
                this.additionalInfoContainer.classList.remove("open");
            } else {
                this.additionalInfoContainer.classList.add("open");
            }
        };

        this.element = document.createElement("DIV");
        this.element.className = "task-container";
        this.mainInfoContainer = document.createElement("DIV");
        this.mainInfoContainer.className = "main-info-container";

        this.statusIconContainer = document.createElement("DIV");
        this.statusIconContainer.className = "status-icon-container";
        this.statusIconContainer.onclick = openDetails;
        this.statusIcon = document.createElement("I");
        this.statusIconContainer.appendChild(this.statusIcon);
        this.mainInfoContainer.appendChild(this.statusIconContainer);

        this.middleContainer = document.createElement("DIV");
        this.middleContainer.className = "middle-container";
        this.middleContainer.onclick = openDetails;

        this.taskDataTableContainer = document.createElement("DIV");
        this.taskDataTableContainer.className = "task-data-table-container";
        this.taskDataContainer = document.createElement("DIV");
        this.taskDataContainer.className = "task-data-container";
        this.nameContainer = document.createElement("DIV");
        this.nameContainer.className = "name-container";
        this.nameContainer.innerHTML = task.name;
        this.taskDataContainer.appendChild(this.nameContainer);

        this.detailsContainer = document.createElement("DIV");
        this.detailsContainer.className = "details-container";
        this.detailsContainer.innerHTML = task.details;
        this.taskDataContainer.appendChild(this.detailsContainer);
        this.taskDataTableContainer.appendChild(this.taskDataContainer);



        this.actionButtonContainer = document.createElement("DIV");
        this.actionButtonContainer.className = "action-button-container";
        this.taskDataTableContainer.appendChild(this.actionButtonContainer);
        this.middleContainer.appendChild(this.taskDataTableContainer);

        this.progressBar = new ProgressBar(this.middleContainer);
        this.progressBar.startWaiting();
        this.mainInfoContainer.appendChild(this.middleContainer);

        this.cancelContainer = document.createElement("DIV");
        this.cancelContainer.className = "cancel-container";
        this.btnCancel = document.createElement("I");
        this.btnCancel.className = "fa fa-times-circle fa-2x";
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
                        this.task.emit("remove");
                    }
                }
            });
        };
        this.cancelContainer.appendChild(this.btnCancel);
        this.mainInfoContainer.appendChild(this.cancelContainer);
        this.element.appendChild(this.mainInfoContainer);

        this.additionalInfoContainer = document.createElement("DIV");
        this.additionalInfoContainer.className = "additional-info-container";
        this.additionalInfoGrid = new Grid(2, 4);
        this.statusElement = document.createElement("DIV");
        this.additionalInfoGrid.addElement(this.statusElement);
        this.failureInfoElement = document.createElement("DIV");
        this.additionalInfoGrid.addElement(this.failureInfoElement);

        this.startTimeContainer = document.createElement("DIV");
        this.startTimeContainer.innerHTML = `<strong>Started on: </strong>${dateFormat(this.task.startTime, format)}`;
        this.addAditionalInformation(this.startTimeContainer);

        this.finishTimeContainer = document.createElement("DIV");
        this.finishTimeContainer.innerHTML = `<strong>Expeted finish on: </strong> ??`;
        this.addAditionalInformation(this.finishTimeContainer);

        this.additionalInfoContainer.appendChild(this.additionalInfoGrid.element);
        this.element.appendChild(this.additionalInfoContainer);

        this._configureByStatus();
        this._bindEventListeners();
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
        this.statusElement.innerHTML = "<strong>Status: </strong>";

        switch (this.task.status) {
            case Task.Status.CREATED:
                this.statusElement.innerHTML += "CREATED";
                this.statusIcon.className = "fa fa-cogs fa-2x";
                break;
            case Task.Status.RUNNING:
                this.statusElement.innerHTML += "RUNNING";
                this.statusIcon.className = "fa fa-circle-o-notch fa-spin fa-2x";
                break;
            case Task.Status.COMPLETED:
                this.statusElement.innerHTML += "COMPLETED";
                this.statusIcon.className = "fa fa-check fa-2x completed";
                break;
            case Task.Status.FAILED:
                this.statusElement.innerHTML += "FAILED";
                this.failureInfoElement.innerHTML = this.task.failureInfo;
                this.statusIcon.className = "fa fa-exclamation-triangle fa-2x wrong";
                break;
            case Task.Status.CANCELLED:
                this.statusElement.innerHTML += "CANCELLED";
                this.statusIcon.className = "fa fa-exclamation-triangle fa-2x wrong";
                break;
        }
    }

    /**
     * Adds additional information to the additional information table (2x4).
     *
     * @param {HTMLElement} additionalInformation - a DOM element.
     */
    addAditionalInformation(additionalInformation) {
        this.additionalInfoGrid.addElement(additionalInformation);
    }

    /**
     * Adds and shows the action button.
     * The action button should appear when the task finishes.
     */
    _addActionButton() {
        let actionButton = document.createElement("BUTTON");
        actionButton.innerHTML = this.task.customAction["caption"];
        actionButton.className = "btn btn-positive";
        actionButton.onclick = this.task.customAction["onclick"];
        this.actionButtonContainer.appendChild(actionButton);
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
        let format = "mm/dd/yy HH:MM:ss";
        let form = "dd HH:MM:ss";

        this.task.on("run", () => {
            this._configureByStatus();
            this.startTimeContainer.innerHTML = `<strong>Started on: </strong>${dateFormat(this.task.startTime, format)}`;
        });

        this.task.on("success", () => {
            this._configureByStatus();
            this.progressBar.stopWaiting();
            this.progressBar.setBar(100);
            this.finishTimeContainer.innerHTML = `<strong>Finished on: </strong>${dateFormat(this.task.finishTime, format)}`;
            if (Object.keys(this.task.customAction).length > 0) {
                this._addActionButton();
            }
        });

        this.task.on("fail", () => {
            this._configureByStatus();
            this.progressBar.stopWaiting();
            this.finishTimeContainer.innerHTML = `<strong>Failed on: </strong>${dateFormat(this.task.finishTime, format)}`;
        });

        this.task.on("cancel", () => {
            this._configureByStatus();
            this.progressBar.stopWaiting();
            this.finishTimeContainer.innerHTML = `<strong> Cancelled on: </strong>${dateFormat(this.task.finishTime, format)}`;
        });

        this.task.on("progress", () => {
            this.progressBar.stopWaiting();
            this.progressBar.setBar(this.task.progress);
            this.finishTimeContainer.innerHTML = `<strong>Expeted finish in: </strong>${util.parseTimeInterval(this.task.estimateFinishTime())}`;
        });
    }

}

/**
 * Task static utilities.
 */
Task.Utils = class {

    /**
     * Shows map selector modal window for adding a layer to it.
     *
     * @param {string} jsonFile - Layer JSON File path.
     */
    static showMapSelector(jsonFile) {
        var modal = new Modal({
            title: "Choose map:",
            height: "auto"
        });

        let grid = new Grid(1, 2);

        let mapPageExtension = gui.extensionsManager.extensions.mapPage;
        let maps = mapPageExtension.maps;
        let choices = {};
        if (maps) {
            Object.keys(maps).map((key) => {
                choices[key] = maps[key].name;
            });
        }

        let selMap = Input.selectInput({
            label: "Map",
            choices: choices,
            className: "simple form-control"
        });
        let lblMap = document.createElement("LABEL");
        lblMap.innerHTML = "Destination map: ";
        grid.addElement(lblMap, 0, 0);
        grid.addElement(selMap, 0, 1);

        let buttonsContainer = new ButtonsContainer(document.createElement("DIV"));
        buttonsContainer.addButton({
            id: "OkCancel00",
            text: "Cancel",
            action: () => {
                modal.destroy();
            },
            className: "btn-default"
        });
        buttonsContainer.addButton({
            id: "OkAddLayer00",
            text: "Ok",
            action: () => {
                if (jsonFile && Object.keys(maps).length) {
                    mapPageExtension.switchMap(maps[selMap.value],true);
                    mapPageExtension.addLayerFile(jsonFile);
                    let selected = selMap.options[selMap.selectedIndex].text;
                    gui.notify(`Added layer to map ${selected}.`);
                } else {
                    gui.notify(`Error adding layer.`);
                }
                modal.destroy();
            },
            className: "btn-default"
        });
        let footer = document.createElement('DIV');
        footer.appendChild(buttonsContainer.element);
        modal.addBody(grid.element);
        modal.addFooter(footer);
        modal.show();
    }

}

module.exports = Task;
