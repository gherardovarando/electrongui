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


const ToggleElement = require('./ToggleElement')
const util = require('./util.js')
class Modal extends ToggleElement {

  constructor(options) {
    options = options || {}
    let element = util.div('modal')
    element.style.right = options.baseright || '0'
    element.style.left = options.baseleft || '0'
    element.style.top = options.basetop || '0'
    element.style.bottom = options.basebottom || '0'
    element.style['background-color'] = options.backgroundcolor || 'rgba(0,0,0,0.4)'
    element.style.height = options.baseheight || '100%'
    element.style.width = options.basewidth || '100%'

    let content = util.div('modal-content')
    content.style.width = options.width || 'auto'
    content.style.height = options.height || 'auto'
    content.style.maxwidth = options.maxwidth || '100%'
    content.style.maxheight = options.maxheight || '100%'

    if (options.draggable) {
      content.draggable = true

      content.ondragstart = (ev) => {
        ev.dataTransfer.dropEffect = "move"
        content.y = Number(content.style.top.replace("px", ""))
        content.x = Number(content.style.left.replace("px", ""))
        content.mouseY = ev.clientY
        content.mouseX = ev.clientX
      }
      content.ondrag = (ev) => {}

      element.ondrop = (ev) => {
        let dX = ev.clientX - content.mouseX
        let dY = ev.clientY - content.mouseY
        content.style.left = `${content.x+dX}px`
        content.style.top = `${content.y+dY}px`
      }
      element.ondragover = (ev) => {
        ev.preventDefault()
      }
    }

    element.addEventListener('click', () => {
      if (!options.permanent) this.destroy()
      if (typeof options.oncancel === 'function') {
        options.oncancel()
      }
    });

    content.addEventListener('click', (e) => {
      e.stopPropagation()
    });


    element.autofocus = true;
    element.addEventListener("keydown", (e) => {
      if (e.keyCode == 13) { //enter
        if (typeof options.onsubmit === 'function') {
          options.onsubmit()
        }
        if (!options.permanent) this.destroy()
      }
      if (e.keyCode == 27) { //escape or supr
        if (typeof options.oncancel === 'function') {
          options.oncancel()
        }
        if (!options.permanent) this.destroy()
      }
    });


    element.appendChild(content)
    options.parent = options.parent || util.body
    options.parent.appendChild(element)
    super(element)
    this.options = options
    this.content = content
    this.addTitle(options.title)
    this.addBody(options.body)
    this.addFooter(options.footer)
    this.hide()
  }

  destroy() {
    this.hide()
    this.clear()
    this.options.parent.removeChild(this.element)
  }

  addHeader(header) {
    this.addTitle(header)
  }

  addTitle(title) {
    if (title) {
      if (typeof title === 'string') {
        this.header = util.div('modal-header')
        this.header.innerHTML = title
        this.content.insertBefore(this.header, this.content.firstChild)
      } else if (title instanceof ToggleElement) {
        this.header = title
        this.content.insertBefore(this.header.element, this.content.firstChild)
      } else if (title.appendChild) {
        this.header = title
        this.content.insertBefore(this.header, this.content.firstChild)
      }
    }
    return this
  }

  addBody(body) {
    if (body) {
      if (body instanceof ToggleElement) {
        body.element.classList.add('modal-body')
        body.appendTo(this.content)
        this.body = body
      } else if (body.appendChild) {
        body.classList.add('modal-body')
        this.content.appendChild(body)
        this.body = body
      } else if (typeof body === 'string') {
        this.body = util.div('modal-body')
        this.body.innerHTML = body
        this.content.appendChild(this.body)
      }
    }
    return this
  }

  addFooter(footer) {
    if (footer) {
      if (footer instanceof ToggleElement) {
        footer.element.classList.add('toolbar','toolbar-footer')
        footer.appendTo(this.content)
        this.footer = footer
      } else if (footer.appendChild) {
        footer.classList.add('toolbar','toolbar-footer')
        this.content.appendChild(footer)
        this.footer = footer
      } else if (typeof footer === 'string') {
        this.footer = util.div('toolbar toolbar-footer')
        this.footer.innerHTML = footer
        this.content.appendChild(this.footer)
      }
    }
    return this
  }



}





module.exports = Modal
