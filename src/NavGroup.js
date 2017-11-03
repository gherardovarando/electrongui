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
const ToggleElement = require('./ToggleElement.js')

class NavGroup extends ToggleElement {
    constructor(id, parent) {

        //if (document.getElementById(`${parent.id}Nav`)) return
        let element = document.createElement('NAV')
        element.className = 'nav-group'
        element.id = `${id}`
        super(element)
        this._EGTYPE.push('navgroup')
        this.id = `${id}`
        this.items = {}
        this.nItems = 0
        this.title = " "
        let h5 = document.createElement("H5")
        h5.className = "nav-group-title"
        h5.innerHTML = this.title
        this.element.appendChild(h5)
        if (typeof parent.appendChild === 'function') {
            this.appendTo(parent)
        }
    }

    static is(x){
      if (x && x._EGTYPE && Array.isArray(x._EGTYPE) && x._EGTYPE.includes('navgroup')) return true
      return false
    }



    addItem(options) {
        let span = document.createElement('A')
        span.className = 'nav-group-item'
        options.id = options.id || `${this.nItems}`
        span.id = `${this.id}Item${options.id}`

        if (typeof options.title === 'string') {
            span.innerHTML = options.title
        } else {
            span.appendChild(options.title)
        }


        if (typeof options.icon === "string") {
            span.appendChild(util.icon(options.icon))
        } else if (typeof options.image === "string") {
            let img = document.createElement('IMG')
            img.className = 'img-circle media-object pull-left icon'
            img.src = options.image
            img.width = '25'
            img.height = '25'
            span.appendChild(img)
        }

        if (options.toggle) {
            span.onclick = (arg) => {
                let done = false
                let b = span
                if (options.toggle.justOne) {
                    this.applyAll((it) => {
                        it.classList.remove('active')
                    })
                }
                if (b.className.includes('active')) {

                    b.classList.remove('active')
                    if (typeof options.onclick.deactive === 'function') {
                        options.onclick.deactive()
                        done = true
                    }
                } else {
                    b.className = `nav-group-item active`
                    if (typeof options.onclick.active === 'function') {
                        options.onclick.active()
                        done = true
                    }
                }
                if (!done) {
                    if (typeof options.onclick === 'function') {
                        options.onclick()
                    }
                }


            }
        } else {
            span.onclick = options.onclick
        }

        this.items[options.id] = span
        this.element.appendChild(span)
        this.nItems++
    }


    clean() {
        for (let it in this.items) {
            delete this.items[it]
        }
        util.empty(this.element, this.element.firstChild)
    }

    applyAll(f) {
        for (let it in this.items) {
            if (f) {
                f(this.items[it])
            }
        }
    }

    removeItem(id) {
        if (id === undefined || id === null) {
            return
        }
        let item = this.items[id]
        this.element.removeChild(item)
        delete this.items.item
        this.nItems--

    }

    addTitle(title) {
        if (typeof title === 'string') {
            let h5 = document.createElement('H5')
            h5.className = 'nav-group-title'
            h5.innerHTML = title
            this.element.appendChild(h5)
        }
    }

    removeTitle(title) {
        let h5s = this.element.getElementsByClassName('nav-group-title')
        h5s.map((h5) => {
            if (h5s.innerHTML === title) {
                this.element.removeChild(h5)
            }
        })
    }


}

module.exports = NavGroup
