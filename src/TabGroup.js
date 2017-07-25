// Copyright (c) 2016 Mario Juez (mjuez@fi.upm.es)
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

'use strict';

const util = require('./util.js');
const ToggleElement = require('./ToggleElement.js');

class TabGroup extends ToggleElement {

    constructor(parent) {
        if (parent.appendChild && (typeof parent.id === 'string')) {
            let element = util.div(`tab-group`);
            super(element);
            this.tabItems = {};
            this.appendTo(parent);
        }
    }

    addItem(config) {
        let cssclass = `tab-item`;
        if(Object.keys(this.tabItems).length === 0){
            cssclass = `${cssclass} active`;
        }

        let tabItem = util.div(cssclass, config.name);
        tabItem.addEventListener('click', () => {
            if (!tabItem.classList.contains(`active`)) {
                Object.keys(this.tabItems).map((key) => {
                    if (this.tabItems[key].classList.contains(`active`)) {
                        this.tabItems[key].classList.remove(`active`);
                    }
                });

                tabItem.classList.add(`active`);
            }
        });
        this.tabItems[config.id] = tabItem;
        this.element.appendChild(tabItem);
    }

    addClickListener(id, listener) {
        let tabItem = this.tabItems[id];
        tabItem.addEventListener('click', listener);
    }

}

module.exports = TabGroup;
