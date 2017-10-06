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
const EventEmitter = require('events')
const util = require('./util')

class ToggleElement extends EventEmitter {
    constructor(element) {
        super()
        if (!element) {
            element = util.div()
        }
        this.element = element
        this.id = element.id
    }

    appendTo(par) {
        if (!this.element) return
        if (!par) return
        if (typeof par.appendChild === 'function') {
            par.appendChild(this.element)
            this.parent = par
        }
    }

    appendChild(el) {
        if (this.element) {
            if (el.element) {
                this.element.appendChild(el.element)
            } else if (el.appendChild) {
                this.element.appendChild(el)
            }
        }
    }

    removeChild(el) {
        if (this.element) {
            if (el.element) {
                this.element.removeChild(el.element)
            } else if (el.appendChild) {
                this.element.removeChild(el)
            }
        }
    }


    clear() {
        util.empty(this.element, this.element.firstChild)
    }

    show() {
        this.element.style.display = ""
        this.emit('show')
    }

    hide() {
        this.element.style.display = "none"
        this.emit('hide')
    }


    toggle() {
        if (this.element.style.display === 'none') {
            this.show()
        } else {
            this.hide()
        }
    }

    isHidden() {
        return this.element.style.display === 'none'
    }

    addToggleButton(options) {
        let opt
        if (options.buttonsContainer) {
            opt = {
                text: options.text,
                id: options.id || this.id,
                icon: options.icon,
                toggle: false,
                className: options.className,
                groupId: options.groupId,
                groupClassName: options.groupClassName,
                action: () => {
                    if (typeof options.action === 'function') options.action()
                    this.toggle()
                }
            }
            options.buttonsContainer.addButton(opt)
            this.buttonsContainer = options.buttonsContainer

            this.on('show', (e) => {
                if (this.buttonsContainer.buttons[opt.id]) {
                    this.buttonsContainer.buttons[opt.id].classList.add('active')
                }
            })

            this.on('hide', (e) => {
                if (this.buttonsContainer.buttons[opt.id]) {
                    this.buttonsContainer.buttons[opt.id].classList.remove('active')
                }
            })
        }


    }
    removeToggleButton(id) {
        this.buttonsContainer.removeButton(id || this.id)
    }
}

module.exports = ToggleElement
