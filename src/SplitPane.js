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

"use strict";

const ToggleElement = require('./ToggleElement');


class SplitPane extends ToggleElement {
    constructor(element) {
        super(element);
        this.element.className = 'pane';
        this.top = new ToggleElement(document.createElement('DIV'));
        this.top.element.className = 'h-pane-top';
        this.top.element.style.height = "100%";
        this.appendChild(this.top);

        this.bottom = new ToggleElement(document.createElement('DIV'));
        this.bottom.element.className = 'h-pane-bottom';
        this.bottom.element.style.height = "0%";
        this.appendChild(this.bottom);

    }

    showBottom(x) {
        this.bottom.element.style.height = `${x||70}%`;
        this.top.element.style.height = `${(100-x)||30}%`;
    }

    hideBottom() {
        this.top.element.style.height = "100%";
        this.bottom.element.style.height = "0%";
    }

    toggleBottom() {
        if (this.bottom.element.style.height == "0%") {
            this.showBottom();
        } else {
            this.hideBottom();
        }
    }


}


module.exports = SplitPane;
