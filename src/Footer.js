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
const ProgressBar = require('./ProgressBar')


class Footer extends ToggleElement {
  constructor(element, parent) {
    super(element)
    if (parent) {
      this.appendTo(parent)
    }
  }


  addNotificationBar() {
    this.notificationBar = new ToggleElement(document.createElement('DIV'))
    this.notificationBar.element.className = 'pull-right'
    this.notificationBar.message = document.createElement('STRONG')
    this.notificationBar.element.appendChild(this.notificationBar.message)
    this.element.appendChild(this.notificationBar.element)
    return this
  }

  addProgressBar() {
    this.progressBar = new ProgressBar(this.element)
    return this
  }

  notify(){
    this.notificationBar.message.innerHTML = message
  }
  
}

module.exports = Footer
