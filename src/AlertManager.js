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

const EventEmitter = require('events')
const ToggleElement = require('./ToggleElement')
const Alert = require('./Alert')
const util = require('./util')

let icons = {
  default: 'fa fa-info',
  warning: 'fa fa-warning',
  danger: 'fa fa-exclamation',
  success: 'fa fa-check',
  error: 'fa fa-code'
}

class AlertManager extends EventEmitter {
  constructor(x) {
    super()
    this.max = Math.max(1, x || 0)
    this.alerts = []
    this.container = new ToggleElement(util.div('gui-alert-container'))
    this.addContainer()
  }

  setMax(x) {
    if (x > 0) {
      this.max = x
      this._check()
    }
  }

  addContainer() {
    this.container.appendTo(document.getElementsByTagName('BODY')[0])
  }

  removeContainer() {
    this.container.remove()
  }

  add(body, status) {
    this._check()
    let alert
    let timeout = null
    if (body instanceof Alert || typeof body.hide === 'function' ) {
      alert = body
    } else {
      if (status === 'success') timeout = 3000
      if (status === 'default') timeout = 5000
      alert = new Alert({
        body: body,
        status: status || 'default',
        icon: icons[status || 'default'],
        sticky: false,
        timeout: timeout
      })
    }

    this.alerts.push(alert)
    alert.on('remove', () => {
      this.alerts.splice(this.alerts.indexOf(alert), 1)
    })

    alert.appendTo(this.container)
    return alert
  }

  _check() {
    if (this.alerts.length >= this.max) {
      this.alerts[0].remove()
      this._check()
    }
  }



}



module.exports = AlertManager
