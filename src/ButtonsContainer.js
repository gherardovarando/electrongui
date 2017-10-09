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

const util = require('./util.js')
const ToggleElement = require('./ToggleElement')

class ButtonsContainer extends ToggleElement {
  constructor(element) {
    super(element)
    if (!(typeof this.element.id === 'string')) this.element.id = "ButtonsContainer"
    this.id = this.element.id
    this.buttons = {}
    this.buttonGroups = {}
    this.nButtons = 0
    this.nButtonGroups = 0
  }


  // options = {id, className, text, icon, groupId, toggle, action }
  addButton(options) {
    if (!options) return null
    if (!(typeof options.className === 'string')) options.className = 'btn-default'
    if (!(typeof options.id === 'string')) options.id = `${this.nButtons}`
    let btn = document.createElement('BUTTON')
    btn.id = `${this.id}Button${options.id}` //so the id is not the DOM id
    btn.className = `btn ${options.className}`
    btn.role = "button"
    btn.title = options.title || options.text || ''
    if (typeof options.text === 'string') {
      btn.innerHTML = options.text
    }

    if (options.icon) {
      btn.appendChild(util.icon(options.icon))
    }

    if (options.toggle) {
      btn.onclick = (arg) => {
        let done = false
        if (btn.classList.contains('active')) {
          btn.classList.remove('active')
          if (typeof options.action.deactive === 'function') {
            options.action.deactive(btn)
            done = true
          }
        } else {
          btn.classList.add('active')
          if (typeof options.action.active === 'function') {
            options.action.active(btn)
            done = true
          }
        }
        if (!done && (typeof options.action === 'function')) {
          options.action(btn)
        }

      }
    } else {
      if (typeof options.action === 'function') {
        btn.onclick = options.action
      }
    }


    if (typeof options.groupId === 'string') {
      if (this.buttonGroups[options.groupId]) {
        this.buttonGroups[options.groupId].appendChild(btn)
      } else {
        this.addButtonGroup({
          id: options.groupId,
          className: options.groupClassName || ``
        })
        this.buttonGroups[options.groupId].appendChild(btn)
      }
    } else {
      this.element.appendChild(btn)
    }

    this.buttons[options.id] = btn
    this.nButtons++
    return btn

  }

  removeButton(id, force) {
    if (typeof id === 'string') {
      if (this.buttons[id]) {
        let btn = this.buttons[id]
        if (btn) {
          btn.parentNode.removeChild(btn)
        } else if (force) {
          btn = document.getElementById(id)
          if (btn) {
            btn.parentNode.removeChild(btn)
          }
        }
        delete this.buttons[id]
      }
    }
  }

  modifyButton(id, options) {
    //will implement
  }

  addButtonGroup(options, buttons) {
    options = options || {}
    options.className = options.className || ''
    if (!(typeof options.id === 'string')) options.id = `${this.nButtonGroups++}`
    let grp = util.div(`btn-group ${options.className}`)
    grp.id = `${this.id}ButtonGroup${options.id}`
    this.buttonGroups[options.id] = grp
    if (buttons instanceof Array) {
      buttons.map((btn) => {
        btn.groupId = options.id
        this.addButton(btn)
      })
    }
    this.element.appendChild(grp)
    return grp
  }

  removeButtonGroup(id, force) {
    if (typeof id === string) {
      if (this.buttonGroups[id]) {
        let btng = document.getElementById(`${this.id}ButtonGroup${id}`)
        if (btng) {
          btng.parentNode.removeChild(btng)
        } else if (force) {
          btng = document.getElementById(id)
          if (btng) {
            btng.parentNode.removeChild(btng)
          }
        }
        delete this.buttonGroups[id]
      }
    }
  }



}

module.exports = ButtonsContainer
