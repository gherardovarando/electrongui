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

const util = require('./util.js')
const ToggleElement = require('./ToggleElement')


class Button extends ToggleElement {
    constructor(options) {
        options = options || {}
        super(document.createElement('BUTTON'), options.parent)
        this.element.className = options.className
        this.element.classList.add('btn')
        this.element.innerHTML = options.text || ''
        this.element.title = options.title || options.text || ''
        if (options.icon) {
            this.appendChild(util.icon(options.icon))
        }

        if (options.toggle) {
            this.element.onclick = (e) => {
                let done = false
                if (this.element.classList.contains('active')) {
                    this.element.classList.remove('active')
                    if (typeof options.action.deactive === 'function') {
                        options.action.deactive(this, e)
                        done = true
                    }
                } else {
                    this.element.classList.add('active')
                    if (typeof options.action.active === 'function') {
                        options.action.active(this, e)
                        done = true
                    }
                }
                if (!done && (typeof options.action === 'function')) {
                    options.action(this, e)
                }

            }
        } else {
            if (typeof options.action === 'function') {
                btn.onclick = (e) => {
                    options.action(this, e)
                }
            }
        }


    }


}

module.exports = Button
