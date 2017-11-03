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


class Alert extends ToggleElement {
  constructor(options) {
    options = options || {
      body: '',
      status: 'default',
      icon: ''
    }
    super(util.div(`gui-alert gui-alert-${options.status}`))
    this.options = options
    this._EGTYPE = 'alert'
    let ic = util.div('gui-alert-icon')
    ic.appendChild(util.icon(options.icon))
    this.appendChild(ic)
    if (options.body && options.body.appendChild) {
      this.body = options.body
    } else {
      this.body = util.div('gui-alert-body', options.body)
    }
    this.appendChild(this.body)
    this.element.onclick = () => {
      if (!options.sticky) {
        this.hide()
        this.remove()
      }
    }
    if (options.timeout) {
      setTimeout(() => {
        this.remove()
      }, options.timeout)
    }
  }

  setBodyText(text) {
    if (this.body.element) this.body.element.innerHTML = text
    else this.body.innerHTML = text
  }

  setStatus(status) {
    this.element.classList.remove(`gui-alert-${this.options.status}`)
    this.element.classList.add(`gui-alert-${status}`)
    this.options.status = status
  }

  static is(x) {
    if (x._EGTYPE === 'alert') return true
    return false
  }

}

module.exports = Alert
