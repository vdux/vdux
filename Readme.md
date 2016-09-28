
# vdux

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Stateless virtual dom &lt;-&gt; Redux.

## Installation

    $ npm install vdux

### Running the examples

    $ cd examples/basic && budo --live index.js -- -t babelify

## Minimal counter example

```javascript
import vdux from 'vdux/dom'
import element from 'vdux/element'
import ready from 'domready'

/**
 * Initialize the app
 */

const initialState = {
  counter: 0
}

function reducer (state, action) {
  if (action.type === 'INCREMENT') {
    return {...state, counter: state.counter + 1}
  }

  return state
}

const {subscribe, render} = vdux({reducer, initialState})

ready(() => {
  subscribe(state => {
    render(<Counter value={state.counter} />)
  })
})

/**
 * App
 */

const Counter = {
  render ({props}) {
    return <div onClick={increment}>Value: {props.value}</div>
  }
}

function increment () {
  return {
    type: 'INCREMENT'
  }
}
```

## Usage

vdux is an opionated, higher-level abstraction over [redux](https://github.com/rackt/redux) and [virtex](https://github.com/ashaffer/virtex). To initialize it, it takes an object containing several parameters:

  * `middleware` - An array containing redux middleware you want to use. Defaults to `[]`.
  * `reducer` - Your root redux reducer
  * `initialState` - The initial state atom for your application. Defaults to `{}`.
  * `node` - The root node you want to render `app` into. Defaults to `document.body`.

This returns an object with a few functions:

  * `subscribe(fn)` - Takes a function and gets called with a new state whenever the state updates. Returns a `stop()` function.
  * `render(vtree, context, force)` - Takes a vtree (e.g. `render(<App state={state} />)`). `context` is an argument that will be passed to the `getProps` function of every component, and `force`, if true, will ignore the `shouldUpdate` functions in all your components for this particular render (useful for hot reloading).
  * `replaceReducer(reducer)` - Replace the reducer (e.g. for hot reloading)
  * `dispatch(action)` - Manually dispatch an action. If you have outside event sources or want to dispatch manually for testing purposes, use this.
  * `getState()` - Returns the current redux state atom.

### The subscribe/render cycle

Primarily you'll be interested in `subscribe` and `render`. These two functions work together to create your application's primary event loop. You set it up like this:

```javascript
subscribe(state => {
  render(<App state={state} />)
})
```

And from then on, state updates will cause renders, and DOM events from your rendered UI will cause state updates.

## JSX / Hyperscript

vdux's JSX pragma is accessible on `vdux/element`. E.g.

```javascript
import element from 'vdux/element'

export default function render () {
  return <div>Hello world!</div>
}
```

### babelrc

Put this in your `.babelrc` and `npm install babel-plugin-transform-react-jsx` to make JSX work with vdux's `element` creator.

```json
"plugins": [
  ["transform-react-jsx", {"pragma": "element"}]
]
```

## DOM Events / Actions

Your event handlers are pure functions that return a value. That value is then dispatched into redux. This forms a [cycle](https://github.com/cyclejs/cycle-core) that will define your entire application in a side-effect free way.

Using hyperscript:

```javascript
import h from 'vdux/element'

function counter ({props}) {
  return h('div', {'onClick': increment}, ['Value: ' + props.counter])
}

function increment () {
  return {
    type: 'INCREMENT'
  }
}
```

Or using JSX:

```javascript
import element from 'vdux/element'

function render ({props}) {
  return <div onClick={increment}>Value: {props.counter}</div>
}

function increment () {
  return {
    type: 'INCREMENT'
  }
}

export default render
```

### Event names

Also of note, vdux is unopinionated about the casing of event handler prop names. If you are wondering if it's `onKeyDown` or `onKeydown`, both/all will work, even `ONKEYDOWN`, or `onkeydown`. As long as it matches the case-insensitive regex `on(?:domEventNames.join('|'))`, it'll work. If you want to know whether an event you want is included, check out [dom-events](https://github.com/micro-js/dom-events) for the complete list - and if one you want isn't there, just send a PR to that module.

## `element` sugar

The JSX pragma `element` comes with a bit of syntactic sugar to make your life easier out of the box. If you don't like its opinions or don't use its features and don't want them bloating your bundle, you can write your own on top of the `element` exported by [virtex](https://github.com/ashaffer/virtex) and use that instead.

### Events

If you want to do more than one thing in response to an event, you can pass an array of handlers, like this:

```javascript
function render () {
  return <div onClick={[fetchPosts, closeDropdown]}></div>
}
```

The return values of both handlers will be dispatched into redux. There is also a set of special syntax for keyboard related events - you may pass an object containing the particular [keychords](https://github.com/micro-js/keychord) you want to select for. E.g.

```javascript
function render () {
  return <input onKeydown={{enter: submit, esc: cancel, 'shift+enter': newline}} />
}
```

## Inline styles

`element` includes some minimal inline style sugar for you. It won't do autoprefixing or anything complicated, but you can pass in a basic style object and have it turned into a style string, automatically. E.g.

```javascript
function render () {
  return <div style={{color: 'red', fontWeight: 'normal'}}></div>
}
```

Will produce a style string of `'color: red; font-weight: normal'`.

## Class names

The [classnames](https://github.com/JedWatson/classnames) module is used for this. So you can do:

```javascript
function render () {
  return <div class={['primary', 'button']}>hello world</div>
}
```

Or you can do:

```javascript
function render ({props}) {
  return <div class={{primary: !!props.primary, button: true}}>hello world</div>
}
```

You can also recursively mix and match these things, like `['class1', {class2: props.class2}]`.

## Focus

`element` allows you to declaratively focus on an element by setting the `focused` property to true. Like this:

```javascript
function render ({props}) {
  return <input focused={props.shouldFocus} />
}
```

Do be careful though that you're not setting `focused` on multiple elements at the same time, otherwise which one ends up actually receiving focus will be undefined (and amount to which one renders first).

## Components

Components in vdux look a lot like components in other virtual dom libraries. You have a `render`, and some lifecycle hooks. Your `render` function receives a `model` that looks like this:

  * `props` - The arguments passed in by your parent
  * `children` - The child elements of your component
  * `state` - The state of your component
  * `local` - Directs an action to the current component's reducer (see the local state section)
  * `path` - The dotted path to your component in the DOM tree. For the most part, you probably don't need to worry about this.

### shouldUpdate

By default, this is taken care of for you. [virtex-component](https://github.com/ashaffer/virtex-component) assumes that your data is immutable, and will do a shallow equality check on `props` and `children` to decide if your component needs to re-render. If you want to implement your own, it works like this (this is the one [virtex-component](https://github.com/ashaffer/virtex-component) uses):

```javascript
function shouldUpdate (prev, next) {
  return !arrayEqual(prev.children, next.children) || !objectEqual(prev.props, next.props)
}
```

Where `prev` is the previous model and `next` is the next model.

### Hooks

  * `onCreate` - When the component is created. Receives `model`.
  * `onUpdate` - When the model changes. Receives `prev` and `next` models.
  * `afterRender` - Called after any render. Passed the model and the root DOM node of the component. Runs only in the browser. It is recommended that you avoid using it as much as possible - but it is necessary in a few cases like positioning elements relative to one another.
  * `onRemove` - When the component is removed. Receives `model`.

## Local state

In vdux, all of your state is kept in your global redux state atom under the `ui` property. In order to support component local state, your component may export two additional functions:

  * `initialState` - Receives `model` and returns the starting state for your component.
  * `reducer` - A reducing function for your component's state. Receives `(state, action)` and returns a new state.

### afterRender / nextTick

The afterRender function can be used to do things after the element has been parented in the DOM. But sometimes it is also important to do something in your afterRender, and then on precisely the next tick *before* the next render, to do something else (e.g. adding an 'active' class that initiates an animation). You can do this in a guaranteed, safe way by returning a function or array of functions from your `afterRender`. This function is guaranteed to be executed on the next tick and before any additional render calls.  E.g.

```javascript
function afterRender ({props}, node) {
  if (props.entering) {
    addClass(node, 'enter')
    return () => addClass(node, 'enter-active')
  }
}
```

### local

The `local` function is how you update the state of your component. It accepts a function that returns an action, and returns a function that creates an action directed to the current component. That's may be a bit hard to digest, so here's an example:

```javascript
function initialState () {
  return {
    value: 0
  }
}

function render ({local, state}) {
  return <div onClick={local(increment)}>Counter: {state.counter}</div>
  )
}

function increment () {
  return {
    type: 'INCREMENT'
  }
}

function reducer (state, action) {
  if (action.type === 'INCREMENT') {
    return {
      value: state.value + 1
    }
  }
}

export default {
  initialState
  render,
  reducer
}
```

### Context / getProps

Sometimes it's too cumbersome to pass everything down from the top of your app. Things like the current url, logged in user, or theme might be too ubiquitous at the leaves of your tree to warrant manually propagating them down via props. For these cases, there is a way out: Context. Context let's you define an object at the top level that any component in the tree can tap into. It is passed as the second argument to render, like this:

```javascript
subscribe(state => {
  render(<App {...state} />, {url: state.url, currentUser: state.currentUser})
})
```

Your components may then tap into this context using their `getProps` method. `getProps` is the only way for components to access context, and this limitation is by design - context should only be used when it is absolutely necessary.

```javascript
function getProps (props, context) {
  return {
    ...props,
    url: context.url
  }
}

function render ({props}) {
  return <span>The current url is: {props.url}</span>
}
```

Keep in mind that any change to context will cause your entire app to re-render, so only put values in it that change relatively infrequently.

### Refs

In React, refs let you call functions on other components. vdux does not have a native way of accomplishing this. In vdux, this is considered something of an anti-pattern, and should be avoided as much as possible. However, if you do need to do it, the convention is to use a `ref` prop to expose your component's API, like this:

```javascript
import Dropdown from 'components/dropdown'

function render () {
  let open

  return (
    <button onClick={e => open()}>Open Dropdown</button>
    <Dropdown ref={_open => open = _open}>
      <li>item</li>
    </Dropdown>
  )
}
```

In dropdown.js you'd then do:

```javascript
function render ({props, local}) {
  if (props.ref) props.ref(local(open))

  return (
    // Render the dropdown, etc...
  )
}


function open () {
  return {
    type: 'OPEN'
  }
}
```

## Global event handlers

Sometimes you want to listen to events on the window or the document in your components. For instance, to close a dropdown on an external click. This can be awkward and error prone, because you have to store a reference to the handler, and then keep it in sync with the life-cycle of your component. To address this vdux exports some special components to make this nice for you, `Window`, `Document` and `Body`, that allow you to bind event handlers to each of these elements in the exact same way you bind to any other events.

### Example - Closing a dropdown on an external click

```javascript
import Document from 'vdux/document'

function render ({local, children}) {
  return (
    <Document onClick={local(close)}>
      <div class='dropdown'>
        {children}
      </div>
    </Document>
  )
}
```

### Example - Router

```javascript
import Window from 'vdux/window'
import Document from 'vdux/document'
import HomePage from 'pages/home'
import enroute from 'enroute'

const router = enroute({
  '/': () => <HomePage />
})

function render ({local, state}) {
  return (
    <Window onPopstate={local(setUrl)}>
      <Document onClick={handleLinkClicks(local(setUrl))}>
        {
          router(state.url)
        }
      </Document
    </Window>
  )
}

function handleLinkClicks (setUrl) {
  return e => {
    if (e.target.nodeName === 'A') {
      const href = e.getAttribute('href')
      if (isLocal(href)) {
        e.preventDefault()
        return setUrl(href)
      }
    }
  }
}
```

## Hot module replacement

Since vdux itself is largely stateless, hot module replacement is trivial. All the code you need is:

```javascript
const {subscribe, render, replaceReducer} = vdux({reducer})

subscribe(state => {
  render(<App state={state} />)
})

if (module.hot) {
  module.hot.accept(['./app', './reducer'], () => {
    replaceReducer(require('./reducer'))
    App = require('./app')
  })
}
```

vdux returns an object containing the `replaceReducer` function that allows you to swap out your `reducer` function. If you want to swap out something else (like middleware), you should probably reload the page, as it may be stateful. If people want something like this though i'll add it in the future.

## Server-side rendering

Server-side rendering uses `vdux/string`. And its interface is essentially the same as the DOM renderer:

```javascript
import vdux from 'vdux/string'
import createServerMiddleware from './server-middleware'

function prerender (req, res) {
  const {subscribe, render} = vdux({
    middleware: createServerMiddleware(req),
    reducer,
    initialState
  })

  const stop = subscribe(state => {
    const html = render(<App state={state} />)

    if (state.ready) {
      stop()
      res.send(html)
    }
  })
}
```

## Side-effects

Almost side-effect free, anyway. You still need to do things like issue requests. I recommend you contain these effects in your redux middleware stack. Here are some libraries / strategies for doing this:

  * [redux-effects](https://github.com/redux-effects/redux-effects)
  * [redux-thunk](https://github.com/gaearon/redux-thunk)
  * [redux-promise](https://github.com/acdlite/redux-promise)

## Ecosystem

### Internal submodules

vdux itself is very small. It is primarily composed of other, smaller modules:

  * [redux](https://github.com/rackt/redux) - Functional state container.
  * [virtex](https://github.com/ashaffer/virtex) - The redux-based virtual dom library used by vdux. You don't need to use this - it's already in vdux, but you will need to add virtex middleware to your redux middleware stack.
  * [virtex-element](https://github.com/ashaffer/virtex-element) - A high-level, opionated JSX pragma for virtex nodes. You probably want to use this for getting started, but later on you may be interested in adding your own sugary element creators.
  * [virtex-dom](https://github.com/ashaffer/virtex-dom) - DOM rendering redux middleware backend for virtex. You need this if you want to be rendering DOM nodes.
  * [virtex-string](https://github.com/ashaffer/virtex-string) - String rendering redux middleware backend. Use this for server-side rendering and tests.
  * [virtex-component](https://github.com/ashaffer/virtex-component) - Lets virtex understand components. Adds nice react/deku-style components with hooks, `shouldUpdate`, and other civilized things.
  * [virtex-local](https://github.com/ashaffer/virtex-local) - Give your components local state, housed inside your redux state atom. Note that you will also need [redux-ephemeral](https://github.com/ashaffer/redux-ephemeral) mounted into your reducer for this to work.
  * [redux-ephemeral](https://github.com/ashaffer/redux-ephemeral) - Allows your reducer to manage transient local state (i.e. component local state).

If you want to try something more advanced, you can create your own vdux by composing these modules and inserting others in your own way.

### Components

Take a look at the org [vdux-components](https://github.com/vdux-components) for more.

  * [delay](https://github.com/vdux-components/delay) - Delay the rendering of child components, or execution of an action for a declaratively specified period.
  * [hover](https://github.com/vdux-components/hover) - Hover component

## License

The MIT License

Copyright &copy; 2015, Weo.io &lt;info@weo.io&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
