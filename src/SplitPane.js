// Copyright (c) 2016 Gherardo Varando (gherardo.varando@gmail.com)
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

const ToggleElement = require('./ToggleElement')
const util = require('./util.js')


class SplitPane extends ToggleElement {
    constructor(element, type, x) {
        super(element)
        type = type || 'v'
        this.element.className = 'pane split-pane'
        this.one = new ToggleElement(util.div(`${type}-pane`))
        this.one.element.style.height = '100%'
        this.one.element.style.width = '100%'
        this._dim = x || 40
        this.appendChild(this.one)
        let isDragging = false
        let drag = util.div()
        drag.appendChild(util.div(`line drag-${type}`))
        element.appendChild(drag)

        this.two = new ToggleElement(util.div(`${type}-pane`))
        this.two.element.style.height = "0%"
        this.appendChild(this.two)

        drag.onmousedown = () => {
            isDragging = true
            this.one.element.classList.add('resizing')
            this.two.element.classList.add('resizing')
            this.one.element.style.cursor = 'col-resize'
            this.two.element.style.cursor = 'col-resize'
        }

        element.onmousemove = (e) => {
            if (isDragging) {
                let elemRect = element.getBoundingClientRect()
                if (type === SplitPane.Type.HORIZONTAL) {
                    let percentageLeft = ((e.pageX - elemRect.left) / element.offsetWidth) * 100
                    let percentageRight = 100 - percentageLeft
                    this._dim = percentageLeft
                    if (percentageRight > 3 && percentageRight < 97) {
                        this.one.element.style.width = `${percentageLeft}%`
                        this.one.element.style.width = `${percentageRight}%`
                    }
                } else if (type === SplitPane.Type.VERTICAL) {
                    let percentageOne = ((e.pageY - elemRect.top) / element.offsetHeight) * 100
                    let percentageTwo = 100 - percentageOne
                    if (percentageTwo > 3 && percentageTwo < 97) {
                        this._dim = percentageTwo
                        this.one.element.style.height = `${percentageOne}%`
                        this.two.element.style.height = `${percentageTwo}%`
                    }
                }
            }
        }

        let cl = () => {
            if (isDragging) {
                this.one.element.style.cursor = null
                this.two.element.style.cursor = null
                this.one.element.classList.remove('resizing')
                this.two.element.classList.remove('resizing')
                isDragging = false
            }
        }

        this.on('add',()=>{
          document.addEventListener('mouseup', cl)          
        })

        this.on('remove', () => {
            document.removeEventListener('mouseup', cl)
        })


    }

    showSecondPane(x) {
        if (x > 0 && x <= 100) {
            this._dim = x
        }
        this.two.element.style.height = `${this._dim}%`
        this.one.element.style.height = `${(100-this._dim)||30}%`
    }

    hideSecondPane() {
        this.one.element.style.height = "100%"
        this.two.element.style.height = "0%"
    }

    toggleSecondPane() {
        if (this.two.element.style.height == "0%") {
            this.showSecondPane()
        } else {
            this.hideSecondPane()
        }
    }


    setType(type) {
        if (type === SplitPane.Type.HORIZONTAL) {

        }
        if (type === SplitPane.Type.VERTICAL) {

        }
    }


}

SplitPane.Type = {
    HORIZONTAL: 'h',
    VERTICAL: 'v'
}


module.exports = SplitPane
