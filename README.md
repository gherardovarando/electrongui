# electrongui

[![npm version](https://badge.fury.io/js/electrongui.svg)](https://badge.fury.io/js/electrongui)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.png?v=103)](https://opensource.org/licenses/mit-license.php)
#### [gherardo.varando@gmail.com](mailto:gherardo.varando@gmail.com)

**electrongui** is a skeleton for GUI written in JS/Node/electron framework. It is made of several classes and utilities. The main class is `Gui` that creates an empty interface on the current window. It is not compulsory to create an instance of `Gui` class and every other classes and utilities can be used independently. `electrongui` is meant to be used in Rendered windows and **not** in the main electron process.

## How to use it

- Install electrongui with `npm`

- In the Renderer process of your electron app:

 ```
const {Gui} = require('electrongui')
let gui = new Gui() // create the base gui structure
gui.alerts.add('Gui initialized!!!','warning') //this message should appear in the footer
 ```

- See the [API](https://gherardovarando.github.io/electrongui/API.html)


## How to write extensions

To write an extension you just need to create a npm package (or a simple js file) exporting a `class` that extend the `GuiExtension` class.

```
const {
  GuiExtension,
  util
} = require('electrongui')

class MyExtension extends GuiExtension {

  constructor(gui) {
    super(gui, {
      icon: 'fa fa-bars',
      // alternatively image: 'path-to-image',
      //setting a manuLabel and a menuTemplate
      menuLabel: 'MyExtension',
      menuTemplate: [{
        label: 'Show',
        click: () => this.show()
      }, {
        label: 'action'
      }, {
        label: 'other action'
      }]
    })
  }

  activate() {
    super.activate() //always call super methods
    this.appendMenu()
    // here goes the creation of the elements
    this.appendChild(util.div('padded', 'This is the main element of MyExtension'))
    this.gui.alerts.add('MyExtension activated')
  }

  deactivate() {
    super.deactivate() // clean main pane and menu
    //clean other things that could have been added
    util.notifyOS('MyExtension deactivated')
  }
}

module.exports = MyExtension
```


### The `gui` object

The current `gui` interface (instance of `Gui`) it is passed automatically on creation. And can be obtained with `this.gui` (see example above).

### Requiring modules

You can require Node native modules and Electron ones. Every dependencies that you need can be loaded with `require`. Be sure to list `electrongui` as a dependency.

##### Using the `module.parent.require` trick
If your extension is very simple and do not use any external modules apart from `electrongui` it can be written requiring `electrongui` from the parent module.
This method permit to install extension from single files, without the need to install additional packages.

```
//myextension.js
const {GuiExtension} = module.parent.require('electrongui') // this will require electrongui from the parent module, since the parent moduel is in the application it will find electrongui module.

class MyExtension extends GuiExtension {
  constructor(gui){
    super(gui,{
      icon: 'fa fa-bar'
      })
    // etc..
  }
}

module.exports = MyExtension
```

### Installing the extension

If you want then to integrate your extension in the application, you can directly insert it as a dependency in the `package.json` of the electron app and then create the instance and call the `activate` method (see example below).

```
//renderer.js
const {Gui} = require('electrongui')
const MyExtension = require('myextension')

let gui = new Gui()

let myext = new MyExtension
myext.activate()
```


#### Using the built-in `ExtensionsManager`

The extensions manager instance is available through `gui.extensions` and provides methods to install and manage extensions. If you want to install an extension with the extension manager (useful for developing new extensions), the extension need to be able to find all the dependencies, especially `electrongui`. It is suggested to create a npm-module folder structure for the extension, an appropriate `package.json`. Running `npm install` will build the `node_modules` folder containing all the dependencies.

##### Using ExtensionsManager programmatically

```
const {Gui} = require('electrongui')
let gui = new Gui()

// create alert if the ExtensionsManager run in an error, this is useful when
// ExtensionsManager find an error loading an extension
gui.extensions.on('error',(e)=>{
  gui.alerts.add(e.message, 'danger')
  console.log(e)
  })

// the following will load the extension file with require, then will try to create the extension
gui.extensions.load('myextensionpath') // path to MyExtension.js or to appropriate
                                      //  package.json or just module name if
                                      //  the extension is a npm module and it is                                    
                                      //  installed in a location reachable from
                                      //  the electron app renderer process.
// now the extension is available

gui.extensions.extensions.MyExtension.activate()

```

##### Using ExtensionsManager from the GUI

ExtensionsManager is a GuiExtension and provide also GUI element to operate on extensions.
To use it from the GUI it is necessary to activate it.

```
const {Gui} = require('electrongui')
let gui = new Gui()

gui.extensions.activate()
// now there will be a new menu entry in the application named Extensions
// from there it is possible to install new extensions, selecting the main js file
// moreover it is possible to activate/deactivate extensions
```

### Cleaning the interface on deactivate

The `deactivate` method must clean all the elements added to the interfaces as buttons or menus. The menu created by the menuLabel and menuTemplate options in the creation are automatically removed by `super.deactivate()`. Moreover the `deactivate` method must also remove the event listener added.


## Acknowledgment

Mario Juez [mjuez@fi.upm.es](mailto:mjuez@fi.upm.es) collaborated in part of the code. This project was partially founded by the [Cajal Blue Brain Project](http://cajalbbp.cesvima.upm.es/).

## License

Copyright (c) 2017 Gherardo Varando (gherardo.varando@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
