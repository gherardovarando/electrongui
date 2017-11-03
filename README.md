# electrongui

[![npm version](https://badge.fury.io/js/electrongui.svg)](https://badge.fury.io/js/electrongui)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.png?v=103)](https://opensource.org/licenses/mit-license.php)
#### [gherardo.varando@gmail.com](mailto:gherardo.varando@gmail.com)

**electrongui** is a skeleton for GUI written in JS/Node/electron framework. It is made of several classes and utilities. The main class is `Gui` that creates an empty interface on the current window. It is not compulsory to create an instance of `Gui` class and every other classes and utilities can be used independently. `electrongui` is meant to be used in Rendered windows and **not** in the main electron process.

## How to use it

- Add the [photonkit](http://photonkit.com/) css

- Install electrongui with `npm`

- Add (and modify to your taste) the `src/style/gui.css` file

- In the Renderer process of your electron app:

```
const {Gui} = require('electrongui')
let gui = new Gui() // create the base gui structure
gui.alerts.add('Gui initialized!!!','warning') //this message should appear in the footer
```


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

// create alert if the ExtensionManager run in an error, this is useful when
// ExtensionManager find an error loading an extension
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

##### Using ExtensionManager from the GUI

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

## API

- [Basic Elements](#basic-elements)

  - [ToggleElement](#toggleelement)
  - [ButtonsContainer](#buttonscontainer)
  - [Modal](#modal)
  - [ProgressBar](#progressbar)
  - [ListGroup](#listgroup)
  - [NavGroup](#navgroup)
  - [Sidebar](#sidebar)
  - [Colors](#colors)
  - [SplitPane](#splipane)
  - [FolderSelector](#folderselector)

- [Gui and Extensions](#gui-and-extensions)

  - [Gui](#gui)
  - [GuiExtension](#guiextension)
  - [ExtensionManager](#extensionmanager)
  - [Workspace](#workspace)
  - [TaskViewer](#taskviewer)
  - [TaskManager](#taskmanager)
  - [Task](#task)
  - [AlertManager](#alertmanager)
  - [Alert](#alert)

- [Utilities](#utilities)

  - [util](#util)
  - [input](#input)

## Basic Elements

### ToggleElement

Extends [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter).

Class that represent an html element that can be shown/hided and emit events accordingly.

All the `ToggleElement` instances are linked on creation to a HTML element. The element is accessible with `this.element`. If the element is not supplied on creation it will be created as an empty DIV element.

```
let body = document.getElementsByTagName('body')[0]
const {ToggleElement} = require('electrongui')
var el = document.createElelement('DIV')
var togEl = new ToggleElement(el, body)
togEl.element === el // true
```

#### Creation

`new ToggleElement(element, parent)`

- element HTMl element
- parent HTMl element or ToggleElement

#### Methods

##### `appendTo(element)`

- `element` an HTML element or an instance of `ToggleElement`.

Append `this.element` to `element`. Return `this`.

##### `appendChild(element)`

- `element` an HTML element or an instance of `ToggleElement`.

Append `element` as a child of `this.element`. Return `this`.

##### `removeChild(element)`

- `element` an HTML element or an instance of `ToggleElement`.

Remove `element` from the children of `this.element`. Return `this`.

##### `remove()`

Remove from the parent (if set with `this.appendTo(parent)`). Return `this`.

##### `clear()`

Remove all the children of `this.element`. Return `this`.

##### `show()`

Display the element, set `this.element.style.display = ''`. Return `this`.

##### `hide()`

Display the element, set `this.element.style.display = 'none'`. Return `this`.

##### `toggle()`

Display/hide the element. Return `this`.

##### `isHidden()`

return `true` if the element is hidden.

##### `addToggleButton(options)`

- `options` options object:

  - `ButtonsContainer` instance of [ButtonsContainer](#buttonscontainer).
  - `text` string, the text to display in the toggle button.
  - `id` string, the id to assign to the button.
  - `icon` string, the icon of the button, use the appropiate css class of fontawesome or photonkit.
  - `className` string, css class of the button.
  - `groupId` string, id of the button group
  - `groupClassName` string, css class of the button group.
  - `action` function, action to perform on element toggling.

Add a toggle button to a preexistent buttonsContainer. Return the button.

##### `removeToggleButton()`

remove the previously added toggle button.

#### Events

##### `show`

Emitted when the element is shown.

##### `hide`

Emitted when the element is hided.

##### `add`

Emitted when the element is added to a parent element (using `appendTo` or `appendChild` ToggleElement methods).

##### `remove`

Emitted when the element is removed from a parent element (using `remove` or `removeChild` ToggleElement methods).

### ButtonsContainer

extends [`ToggleElement`](#toggleelement)

ButtonsContainer is a container for buttons that can be arranged in different groups (see [Photon](http://photonkit.com/)).

```
const {ButtonsContainer} = require('electrongui');

let btnContainer = new ButtonsContainer();

btnContainer.addButton({
  id: 'button1',
  className: 'btn-default',
  icon: 'fa fa-bars',
  groupId: 'group0',
  text: 'a',
  toggle: true,
  action: (btn)=>{
    console.log(btn.innerHTML);
    btn.innerHTML += 'a';
  });
```

#### Methods

##### `addButton(options)`

- `options` object of options:

  - `id` string the id of the html button element.
  - `text` string, the text of the button.
  - `icon` string, the icon of the button.
  - `toggle` logical, if it is a toggable button (active-deactive states).
  - `action` function or object `{active, deactive}` both functions. `function(btn)`, where `btn`is the button. This option permits to add a callback when the button is pressed (`action`) or when it is ativated/deactivated (`active,deactive`) if `toggle` is set to `true`.
  - `groupId` string, the id of the button group, if not present it will be created.
  - `gropuClassName` string, the class name of the group id, it will be used only if the gropu id is not present and thus it will be created.

Return the button element.

##### `removeButton(id, force)`

- `id` string, the id of the button to remove.
- `force` logical, if true, remove the element even uf it is not a button in this container.

##### `addButtonGroup(options, buttons)`

- `options` object:

  - `className` css class of the group.
  - `id` id of the group.

- `buttons` array of buttons options. If present all the respective buttons will be created and added to this group.

Return the button group element

##### `removeButtonGroup(id, force)`

- `id` string.
- `force` logical.

### Modal

extends [`ToggleElement`](#toggleelement)

Create a Modal element.

```
const {Modal} = require('electrongui');

new Modal({
  title: 'I am a modal',
  body: 'drag me',
  draggable: true,
  oncancel: ()=>{
    console.log('exit');
  }
  }).show();
```

#### constructor

`new Modal(options)`

-`options`:

- `draggable` logical, if the modal should be draggable.
- `title` string, html element or ToggleElement, title of the modal.
- `body` html element or ToggleElement, the body of the modal
- `footer` string, html element or ToggleElement, footer of the modal.
- `onsubmit` function, it will be call when the user press the enter key
- `oncancel` function, it it will be call when the user press esc/canc or click outside of the modal.
- `width` string, width of the modal, default to `'auto'`.
- `height` string, height of the modal, default to `'auto'`.
- `maxWidth` string.
- `maxHeight` string.
- `baseright`, `baseleft`, `basetop` , `basebottom` options to position the modal (defualt to 0).
- `baseheight`, `basewidth` options for the size of the base of the modal (usally set to 100%).
- `backgroundcolor` defualt to `rgba(0,0,0,0.4)`.
- `parent` html element or toggle element, default to the `body` element of the window.

#### Methods

##### `destroy()`

Hide and destroy the modal.

##### `addTitle(title)`

- `title` string, HTML element or ToggleElement. Return `this`.

##### `addBody(body)`

- `body` string or html element or ToggleElement. Return `this`.

##### `addFooter(footer)`

-`footer` string or html element or toggle element. Return `this`.

### ProgressBar

extends [`ToggleElement`](#toggleelement)

#### constructor

`new ProgressBar(parent)`

- `parent` an html element or toggle element.

#### Methods

##### `setHeight(h)`

- `h` number, the height Set the height of the progress bar.

##### `setBar(value)`

- `value` number, between 0 and 100. set the progress to `value`

##### `startWaiting()`

make the progress bar start the waiting animation, moving cycling.

##### `stopWaiting()`

stop the waiting animation.

##### `hideBar()`

##### `showBar()`

##### `setColor(color)`

##### `remove()`

##### `add()`

### ListGroup

Create and manage a List group as in [Photon](http://photonkit.com/components/).

#### constructor

`new ListGroup(id, parent)`

- `id` [optional] string
- `parent` html element or toggle element

#### Methods

##### `addItem(options)`

- `options` object of options:

  - `id` string id of the item to add.
  - `image` string, path of the image to use in the list item.
  - `icon` string, icon to use instead of the image.
  - `title` string of the title.
  - `subtitle` string, subtitle of the item.
  - `details` html element or toggle element or string.
  - `toggle` logical, if the element can be toggled.
  - `onclick`, function(item,e) or (if toggle is true) object with:

    - `active` function(item, e)
    - `deactive` function(item, e)

  - `ondblclick`, function(item, e)
  - `oncontextmenu`, function(item, e)
  - `onmouseover`, function(item ,e)
  - `key` string, search keys

##### `removeItem(id)`

- `id` string

remove the given item

##### `addSearch(options)`

- `options`

  - `placeholder` string

add a search field at the top of the list group, will use the keys tag to search in the items list, and display/hide the appropriate items that match the search.

##### `setKey(id, newkey, append)`

- `id` string, id of the item to edit
- `newkey` string, the new key
- `append` logical, if the new key has to be appended or instead substitute the old keys.

Add the new key to the given item's search keys

##### `removeKey(id, key)`

- `id` string
- `key` string

Remove the `key` from the search keys of the item `id`

##### `clean()`

remove all items.

##### `setTitle(id, newtitle)`

- `id`
- `newtitle`

set the new title in the given item.

##### `showItem(id)`

-`id`

show the given item.

##### `hideItem(id)`

-`id`

hide the given item.

##### `activeItem(id)`

- `id`

Active (add css class 'active') to the given item.

##### `deactiveItem(id)`

- `id`

Deactive (remove css class 'active') from the given item.

##### `showAll()`

show all items.

##### `hideAll()`

hide all items

##### `activeAll()`

active all items.

##### `deactiveAll()`

deactive all items.

##### `hideDetails(id)`

- `id`

hide the details element of the given item.

##### `showDetails(id)`

##### `hideAllDetails()`

##### `forEach(f)`

- `f` function(item)

apply a given function `f` to all the items.

### NavGroup

Create and manage a Nav group as in [Photon](http://photonkit.com/components/).

### Sidebar

extends [`ToggleElement`](#toggleelement)

#### constructor

`new Sidebar(parent, options)`

- `parent` html element or toggle element.
- `options` object:

  - `className` css class of the sidebar

#### Methods

##### `addList(arg)`

- arg string or ListGroup

##### `addNav(arg)`

- arg string ot NavGroup

##### `addItem(options)`

add one item to the ListGroup or NavGroup.

##### `remove()`

remove the sidebar.

## Gui and Extensions

### Gui

#### Properties

- `gui.header` Instance of Header.

- `gui.footer` Instance of footer.

- `gui.taskManager` Instance of TaskManager.

- `gui.alerts` Instance of AlertManager.

- `gui.tasks` Instance of TaskManager.

- `gui.workspace` Instance of Workspace.

- `gui.win` Reference to the window object.

#### Methods

- `gui.reloadMenu()`

  Reload the app menu

- `gui.addMenuItem(item)`

  - `item` a MenuItem

- `gui.removeMenuItem(item)`

  - `item` a MenuItem

- `gui.openChildWindow(url, option)`

  - `url` String
  - `options` BrowserWindow options

  Return the BrowserWindow instance.


#### Examples

##### Add a button in the header
```
gui.header.actionsContainer.addButton({
  icon: 'fa fa-bar',
  action: ()=> console.log('click!')
  })
```
##### Write in the footer
```
gui.footer.notify('message!!!!')
```
##### Add a progress bar
```
gui.footer.addProgressBar()
gui.footer.progressBar.setBar(20)
```

##### Create an alert
```
const {Alert} = require('electrongui')
gui.alerts.add('this is a warning','warning')
gui.alerts.add('this is a code error', 'error')
let customAlert = new Alert({
  body: 'custom alert',
  icon: 'fa fa-bell-o',
  status: 'warning',
  timeout: 40000 //after 40 sec the alert will be removed
  })
gui.alerts.add(customAlert)
```

### GuiExtension

Extend this class to create a new extension.

#### Methods

#### Events

### ExtensionManager

#### Methods

#### Events

### Workspace

#### Methods

#### Events

### AlertManager

An instance of AlertManager is available as `gui.alerts`.

#### Methods

- Constructor `new AlertManager(max, parent)`
 - `max` positive number, the maximum number of alerts shown.
 - `parent` HTML element or ToggleElement, where add the container (default to `BODY`).

- `setMax(max)`
 - `max` positive number, the maximum number of alerts shown.

- `addContainer(parent)`
 - `parent` HTML element or ToggleElement

- `removeContainer()`

- `add(body, status)`
 - `body` string, HTML element, ToggleElement or Alert object.
 - `status` string, one of `danger, error, warning, progress, success, default `

### Alert



#### Methods

#### Events

### TaskManager

#### Methods

#### Events

### Task

#### Methods

#### Events

## Utilities

### util

Just a collection of utilities. `const {util} = require('electrongui')`

#### `util.findKeyId(x, obj, tag)`

suppose to have an object as

```
let a = {
  one: {
    id : 145
  },
  two: {
    id : 23
  },
  three: {
    id: 45
  }
}
```

And you want to find the sub-object with properties `id` equal to 23.

```
let target =util.findKeyId(23, a, 'id')
console.log(a[target]) // { id: 23}
```

#### `util.nextKey(obj)`

- `obj` an object

find the first numeric key that is available to assign a new property in the object.

#### `util.parseTimeInterval(s)`

- `s` number, milliseconds

return a human readable string of time from a millisecond value.

#### `util.div(className, text)`

create a div html element

#### `util.setProgress(value)`

set progress with electron progress bar.

#### `util.stringify(object)`

Stringify an object.

#### `util.isNode()`

return true if we are in Node.

#### `util.isElectron()`

#### `util.sum(v)`

Sum all values in the array `v`.

#### `util.mean(v)`

compute the mean of the array `v`.

#### `util.clone(obj)`

Clone an object.

#### `util.notifyOS(text)`

Emit a OS dependent notification with the given text.

#### `util.readJSON(filename, callback, error)`

async read a json file and call callback over the resulting object.

#### `util.readJSONsync(filename,error)`

sync read a json file and return the object.

#### `util.empty(parent,child)`

remove all the child of `parent` starting from `child`.

#### `util.isIcon(icon)`

Decide if an element is an icon.

#### `util.icon(icon)`

create and icon element starting from a string if able otherwise return an empty DIV.

### input

`const {input} = require('electrongui')`

#### `input.checkButton(options)`

- `options` checkButton options object:

  - `className` string
  - `id` string
  - `active` logical
  - `text` string, the text of the button
  - `icon` icon
  - `onclick` function(btn, active), callback on the click event
  - `onactivate` function(btn, active)
  - `ondeactivate` function(btn, active)
  - `autofocus` logical
  - `parent` HTML element or ToggleElement
  - `makeContainer` logical, if a button container should be created (works only if parent is set)

return the HTML element.

#### `input.selectInput(options)`

- `options` selectInput options object:

  - `className`
  - `id`
  - `onchange`
  - `onblur`
  - `oninput`
  - `choices` object or array with choices (option html element will be created for every field):

    - `{ choice1: value1, choice2:value2 }`

  - `parent` HTML element or ToggleElement

#### `input.input(options)`

- `options` input options object:

  - `type` string, like the HTML input element
  - `id`
  - `label`
  - `placeholder`
  - `className`
  - `value`
  - `autofocus`
  - `min`
  - `max`
  - `width`
  - `height`
  - `title`
  - `step`
  - `checked` logical
  - `readOnly` logical
  - `onchange`, `onblur`, `oninput`, `ondblclick`, `onfocusout`, `onclick`, `oncontextmenu` function
  - `parent` HTML element or ToggleElement

## Acknowledgment

Mario Juez [mjuez@fi.upm.es](mailto:mjuez@fi.upm.es) collaborated in part of the code. This project was partially founded by the [Cajal Blue Brain Project](http://cajalbbp.cesvima.upm.es/).

## License

Copyright (c) 2017 Gherardo Varando (gherardo.varando@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
