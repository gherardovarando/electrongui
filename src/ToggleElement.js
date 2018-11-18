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
  constructor(element, par) {
    super()
    if (!element) {
      element = util.div()
    }
    this._EGTYPE = ['toggleelement']
    this.element = element
    this.id = element.id
    if (par) {
      this.appendTo(par)
    }
  }

  static is(x) {
    if (x && x._EGTYPE && Array.isArray(x._EGTYPE) && x._EGTYPE.includes('toggleelement')) return true
    return false
  }

  appendTo(par) {
    if (!this.element) return this
    if (!par) return this
    if (typeof par.appendChild === 'function') {
      par.appendChild(this.element)
      this.parent = par
      this.emit('add')
    }
    return this
  }

  appendChild(el) {
    if (this.element) {
      if (el instanceof ToggleElement) {
        el.appendTo(this)
      } else if (el.appendChild) {
        this.element.appendChild(el)
      }
    }
    return this
  }

  removeChild(el) {
    if (this.element) {
      if (el instanceof ToggleElement) {
        this.element.removeChild(el.element)
        el.emit('remove')
      } else if (el.appendChild) {
        if (this.element.contains(el)) this.element.removeChild(el)
      }
    }
    return this
  }


  clear() {
    util.empty(this.element, this.element.firstChild)
    this.emit('clear')
    return this
  }

  show() {
    this.element.style.display = ""
    this.emit('show')
    return this
  }

  hide() {
    this.element.style.display = "none"
    this.emit('hide')
    return this
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
        title: options.title || options.text,
        action: () => {
          if (typeof options.action === 'function') options.action()
          this.toggle()
        }
      }
      let btn = options.buttonsContainer.addButton(opt)
      this.buttonsContainer = options.buttonsContainer
      this.toggleButton = btn

      this.on('show', (e) => {
        if (btn) {
          btn.classList.add('active')
        }
      })

      this.on('hide', (e) => {
        if (btn) {
          btn.classList.remove('active')
        }
      })

      return btn
    }
  }

  removeToggleButton(id) {
    if (this.buttonsContainer) {
      this.buttonsContainer.removeButton(id || this.id)
    }
    return this
  }

  remove() {
    if (this.parent) {
      this.parent.removeChild(this.element)
      this.emit('remove')
    }
    return this
  }


}

module.exports = ToggleElement
