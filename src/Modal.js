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
    let element = document.createElement('DIV');
    element.style = 'z-index: 100; top: 0;left: 0;width: 100%;height: 100%;overflow: 100%;background-color: rgb(0, 0, 0);background-color: rgba(0, 0, 0, 0.4);position: absolute;text-align: center;'

    let content = document.createElement('DIV')
    content.style = 'position: relative; display: inline-block; text-align: left;background-color: #F6F6F5;margin: 0 auto; border: 1px solid #888; width: auto;height: 100%;max-width: 80%; -webkit-animation-name: animatetop; -webkit-animation-duration: 0.4s; animation-name: animatetop; animation-duration: 0.4s; border-radius: 0 0 5px 5px;'

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
      this.destroy()
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
        this.destroy()
      }
      if (e.keyCode == 27) { //escape or supr
        if (typeof options.oncancel === 'function') {
          options.oncancel()
        }
        this.destroy()
      }
    });

    content.style.width = options.width || 'auto'
    content.style.height = options.height || 'auto'
    content.style.maxwidth = '90%'
    element.appendChild(content)
    options.parent = options.parent || document.getElementsByTagName('BODY')[0]
    options.parent.appendChild(element)
    super(element)
    this.options = options
    this.content = content
    this.addTitle(options.title)
    this.addBody(options.body)
    this.hide()
  }

  destroy() {
    this.hide()
    this.clear()
    this.options.parent.removeChild(this.element)
  }

  addTitle(title) {
    this.header = document.createElement('DIV')
    this.header.style = ' padding: 2px 16px; background-color: #F6F6F5; top: 0; position: relative; border-radius: 5px 5px 0 0; font-weight: bold;'
    this.header.innerHTML = title
    // if (!this.options.noCloseIcon) {
    //     let ic = util.icon('icon icon-cancel-circled pull-right ');
    //     ic.role = 'button';
    //     ic.onclick = () => {
    //         this.destroy();
    //     }
    //     this.header.appendChild(ic);
    // }
    this.content.insertBefore(this.header, this.content.firstChild)
  }

  addBody(body) {
    if (body) {
      if (body.appendChild) {
        body.style.paddingtop = '2px'
        body.style.paddingbottom = '16px'
        body.style.overflow = 'auto'
        this.content.appendChild(body)
        this.body = body
      } else if (typeof body === 'string') {
        this.body = document.createElement('DIV')
        this.body.innerHTML = body
        this.content.appendChild(this.body)
      }
    }
  }

  addFooter(footer) {
    if (footer) {
      if (footer.appendChild) {
        footer.style.paddingbottom = '10px'
        footer.style.paddingtop = '20px'
        footer.style.bottom = 0
        footer.style.position = 'relative'
        this.content.appendChild(footer)
        this.footer = footer
      } else if (typeof footer === 'string') {
        this.footer = document.createElement('DIV')
        this.footer.innerHTML = footer
        this.content.appendChild(this.footer)
      }
    }
  }



}





module.exports = Modal
