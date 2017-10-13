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
'use strict'

//deprecated use splitpane

const ToggleElement = require('./ToggleElement.js')
const util = require('./util.js')

class FlexLayout extends ToggleElement {

    /**
     * Creates a flexible layout with two parts.
     * top and bottom or left and right.
     *
     * @param {HTMLElement} parent The parent where
     *  this layout is going to be appended.
     * @param {FlexLayout.Type} type The layout type,
     *  horizontal or vertical.
     * @param {number} firstContainerSize The size
     *  in percentage of the first container.
     */
    constructor(parent, type, firstContainerSize) {
        let element = util.div('flex-layout')
        super(element)

        let isDragging = false

        this.firstContainer = util.div()
        element.appendChild(this.firstContainer)

        let drag = util.div()
        drag.appendChild(util.div('line'))
        element.appendChild(drag)

        this.lastContainer = util.div()
        element.appendChild(this.lastContainer)

        if (type === FlexLayout.Type.HORIZONTAL) {
            this.firstContainer.className = 'horizontal-container'
            this.firstContainer.style.width = `${firstContainerSize}%`
            this.lastContainer.className = 'horizontal-container right'
            this.lastContainer.style.width = `${100 - firstContainerSize}%`
            drag.className = 'drag-h'
        } else if (type === FlexLayout.Type.VERTICAL) {
            this.firstContainer.className = 'vertical-container'
            this.firstContainer.style.height = `${firstContainerSize}%`
            this.lastContainer.className = 'vertical-container bottom'
            this.lastContainer.style.height = `${100 - firstContainerSize}%`
            drag.className = 'drag-v'
        }

        parent.appendChild(element)

        //
        // EVENTS
        //

        drag.onmousedown = () => {
            isDragging = true
            if (type === FlexLayout.Type.HORIZONTAL) {
                this.firstContainer.style.cursor = 'col-resize'
                this.lastContainer.style.cursor = 'col-resize'
            } else if (type === FlexLayout.Type.VERTICAL) {
                this.firstContainer.style.cursor = 'row-resize'
                this.lastContainer.style.cursor = 'row-resize'
            }
        }

        element.onmousemove = (e) => {
            if (isDragging) {
                let sumPercentages = this.firstContainer + this.lastContainer
                let elemRect = element.getBoundingClientRect()
                if (type === FlexLayout.Type.HORIZONTAL) {
                    let percentageLeft = ((e.pageX - elemRect.left) / element.offsetWidth) * 100
                    let percentageRight = 100 - percentageLeft
                    if (percentageRight > 3 && percentageRight < 97) {
                        this.firstContainer.style.width = `${percentageLeft}%`
                        this.lastContainer.style.width = `${percentageRight}%`
                    }
                } else if (type === FlexLayout.Type.VERTICAL) {
                    let percentageTop = ((e.pageY - elemRect.top) / element.offsetHeight) * 100
                    let percentageBottom = 100 - percentageTop
                    if (percentageBottom > 3 && percentageBottom < 97) {
                        this.firstContainer.style.height = `${percentageTop}%`
                        this.lastContainer.style.height = `${percentageBottom}%`
                    }
                }
            }
        }

        document.onmouseup = () => {
            if (isDragging) {
                this.firstContainer.style.cursor = null
                this.lastContainer.style.cursor = null
                isDragging = false
            }
        }
    }

    /**
     * Appends a HTML element to the first container.
     * @param {HTMLElement} element The element to be
     *  appended.
     */
    appendToFirstContainer(element) {
        this.firstContainer.appendChild(element)
    }

    /**
     * Appends a HTML element to the last container.
     * @param {HTMLElement} element The element to be
     *  appended.
     */
    appendToLastContainer(element) {
        this.lastContainer.appendChild(element)
    }
}

FlexLayout.Type = {
    HORIZONTAL: 0,
    VERTICAL: 1
}

module.exports = FlexLayout
