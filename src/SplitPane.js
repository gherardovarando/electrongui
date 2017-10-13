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
  constructor(element, type) {
    super(element)
    type = type || 1
    this.element.className = 'pane'
    this.top = new ToggleElement(util.div('h-pane-top'))
    this.top.element.style.height = "100%"
    this.appendChild(this.top)
    let isDragging = false
    let drag = util.div()
    drag.appendChild(util.div('line'))
    element.appendChild(drag)

    this.bottom = new ToggleElement(util.div('h-pane-bottom'))
    this.bottom.element.style.height = "0%"
    this.appendChild(this.bottom)

    drag.onmousedown = () => {
      isDragging = true
      this.top.element.style.cursor = 'col-resize'
      this.top.element.style.cursor = 'col-resize'
    }

    element.onmousemove = (e) => {
      if (isDragging) {
        let sumPercentages = this.top.element + this.bottom.element
        let elemRect = element.getBoundingClientRect()
        if (type === FlexLayout.Type.HORIZONTAL) {
          let percentageLeft = ((e.pageX - elemRect.left) / element.offsetWidth) * 100
          let percentageRight = 100 - percentageLeft
          if (percentageRight > 3 && percentageRight < 97) {
            this.top.element.style.width = `${percentageLeft}%`
            this.top.element.style.width = `${percentageRight}%`
          }
        } else if (type === FlexLayout.Type.VERTICAL) {
          let percentageTop = ((e.pageY - elemRect.top) / element.offsetHeight) * 100
          let percentageBottom = 100 - percentageTop
          if (percentageBottom > 3 && percentageBottom < 97) {
            this.top.element.style.height = `${percentageTop}%`
            this.bottom.element.style.height = `${percentageBottom}%`
          }
        }
      }
    }

    document.onmouseup = () => {
      if (isDragging) {
        this.top.element.style.cursor = null
        this.bottom.element.style.cursor = null
        isDragging = false
      }
    }


  }

  showBottom(x) {
    this.bottom.element.style.height = `${x||70}%`
    this.top.element.style.height = `${(100-x)||30}%`
  }

  hideBottom() {
    this.top.element.style.height = "100%"
    this.bottom.element.style.height = "0%"
  }

  toggleBottom() {
    if (this.bottom.element.style.height == "0%") {
      this.showBottom()
    } else {
      this.hideBottom()
    }
  }


}

SplitPane.Type = {
  HORIZONTAL: 0,
  VERTICAL: 1
}


module.exports = SplitPane
