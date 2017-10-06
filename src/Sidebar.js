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

const ToggleElement = require('./ToggleElement.js')
const ListGroup = require('./ListGroup.js')
const NavGroup = require('./NavGroup.js')
const util = require('./util.js')

class Sidebar extends ToggleElement {
    constructor(parent, options) {
        options = Object.assign({
            className: ''
        }, options)
        if (parent.appendChild) {
            let element = util.div(`sidebar ${options.className}`)
            element.id = `${parent.id}Sidebar${parent.getElementsByClassName('sidebar').length}`
            super(element)
            this.parent = parent
            this.hide()
            parent.appendChild(element)
        }

    }

    addList() {
        switch (typeof arguments[0]) {
            case 'string':
                let id = arguments[0]
                if (id === 'nav' || id === 'element' || id === 'parent') return
                let list = new ListGroup(id || `${this.element.id}list`, this.element)
                this[id || 'list'] = list
                this.appendChild(list)
                break
            case 'object':
                if (arguments[0] instanceof ListGroup) {
                    this[arguments[0].id] = arguments[0]
                    this.appendChild(arguments[0])
                } else {
                    this['list'] = new ListGroup('list', this.element)
                    this.appendChild(this['list'])
                }
            default:
                this['list'] = new ListGroup('list', this.element)
                this.appendChild(this['list'])
        }
    }

    addNav() {
        switch (typeof arguments[0]) {
            case 'string':
                let id = arguments[0]
                if (id === 'list' || id === 'element' || id === 'parent') return
                let nav = new NavGroup(id || `${this.element.id}nav`, this.element)
                this[id || 'nav'] = nav
                this.appendChild(nav)
                break
            case 'object':
                if (arguments[0] instanceof NavGroup) {
                    this[arguments[0].id] = arguments[0]
                    this.appendChild(arguments[0])
                } else {
                    this['nav'] = new NavGroup(`nav`, this.element)
                    this.appendChild(this['nav'])

                }
            default:
                this['nav'] = new NavGroup(`nav`, this.element)
                this.appendChild(this['nav'])
        }
    }



    addItem(options) {
        if (this.list) {
            this.list.addItem(options)
        } else if (this.nav) {
            this.nav.addItem(options)
        } else {
            this.addList()  
            this.addItem(options)
        }
    }

    remove() {
        this.parent.removeChild(this.element)
    }

}


module.exports = Sidebar
