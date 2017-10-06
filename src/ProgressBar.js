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
'use strict'

const ToggleElement = require('./ToggleElement')


// ProgressBar <- Bar (ToggleElement)
class ProgressBar extends ToggleElement {
    constructor(parent) {
        let element = document.createElement('DIV')
        element.className = 'progress-bar-container'
        parent.appendChild(element)
        super(element)
        this.parent = parent
        this.value = 0
        this.bar = new ToggleElement(document.createElement('DIV'))
        this.bar.element.className = 'progress-bar'
        this.element.appendChild(this.bar.element)
    }


    setHeight(h){
      this.element.style.height = `${h}px`
      this.bar.element.style.height = `${h}px`
    }

    // value  in  [0,100]
    setBar(value) {
        if (isNaN(value)) return
        this.value = value
        this.bar.element.style.width = `${value}%`
        this.element.title = `${parseInt(value)}%`
        this.showBar()
    }

    startWaiting() {
        let direction = 0.5
        let currentPosition = 0
        this.interval = setInterval(() => {
            let width = 10
            currentPosition += direction
            if (currentPosition >= 100 - width || currentPosition <= 0) {
                direction *= -1
            }
            this.bar.element.style.width = `${width}%`
            this.bar.element.style.left = `${currentPosition}%`
        }, 15)
    }

    stopWaiting() {
        clearInterval(this.interval)
        this.bar.element.style.left = `0%`
    }

    hideBar() {
        this.bar.hide()
    }

    showBar() {
        this.bar.show()
    }

    setColor(color) {
        this.bar.element.style['background-color'] = color || '#4fa8df'
    }

    remove() {
        this.parent.removeChild(this.element)
    }

    add() {
        this.parent.appendChild(this.element)
    }

}

module.exports = ProgressBar
