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
    this.top = new ToggleElement(util.div(`${type}-pane`))
    this.top.element.style.height = '100%'
    this.top.element.style.width = '100%'
    this._dim = x || 40
    this.appendChild(this.top)
    let isDragging = false
    let drag = util.div()
    drag.appendChild(util.div(`line drag-${type}`))
    element.appendChild(drag)

    this.bottom = new ToggleElement(util.div(`${type}-pane`))
    this.bottom.element.style.height = "0%"
    this.appendChild(this.bottom)

    drag.onmousedown = () => {
      isDragging = true
      this.top.element.classList.add('resizing')
      this.bottom.element.classList.add('resizing')
      this.top.element.style.cursor = 'col-resize'
      this.bottom.element.style.cursor = 'col-resize'
    }

    element.onmousemove = (e) => {
      if (isDragging) {
        let sumPercentages = this.top.element + this.bottom.element
        let elemRect = element.getBoundingClientRect()
        if (type === SplitPane.Type.HORIZONTAL) {
          let percentageLeft = ((e.pageX - elemRect.left) / element.offsetWidth) * 100
          let percentageRight = 100 - percentageLeft
          this._dim = percentageLeft
          if (percentageRight > 3 && percentageRight < 97) {
            this.top.element.style.width = `${percentageLeft}%`
            this.top.element.style.width = `${percentageRight}%`
          }
        } else if (type === SplitPane.Type.VERTICAL) {
          let percentageTop = ((e.pageY - elemRect.top) / element.offsetHeight) * 100
          let percentageBottom = 100 - percentageTop
          if (percentageBottom > 3 && percentageBottom < 97) {
            this._dim = percentageBottom
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
        this.top.element.classList.remove('resizing')
        this.bottom.element.classList.remove('resizing')
        isDragging = false
      }
    }


  }

  showBottom(x) {
    if (x>=0 && x<=100){
      this._dim = x
    }
    this.bottom.element.style.height = `${this._dim}%`
    this.top.element.style.height = `${(100-this._dim)||30}%`
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


  setType(type){
     if (type === SplitPane.Type.HORIZONTAL){

     }
     if (type === SplitPane.Type.VERTICAL){

     }
  }


}

SplitPane.Type = {
  HORIZONTAL: 'h',
  VERTICAL: 'v'
}


module.exports = SplitPane
