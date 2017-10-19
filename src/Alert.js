// Copyright (c) 2017 Gherardo Varando (gherardo.varando@gmail.com)
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
const util = require('./util')
let max = 1
let present = []
let container = util.div('gui-alert-container')
document.getElementsByTagName('BODY')[0].appendChild(container)

class Alert extends ToggleElement {
  constructor(status, title, body) {
    super(util.div(`gui-alert gui-alert-${status}`))
    this.appendChild(util.div('gui-alert-title', title))
    this.appendChild(util.div('gui-alert-body', body))
    if ((present.length >= max) && present[0]) {
      present[0].remove()
      present.splice(0, 1)
    }
    present.push(this)
    this.element.onclick = () => {
      this.hide()
      this.remove()
      present.splice(present.indexOf(this),1)
    }
    this.appendTo(container)
  }


  static setMax(x) {
    if (x > 0) {
      max = x
    }
  }

  static clean() {
    present.map((n) => n.remove())
    present = []
  }

}

module.exports = Alert
