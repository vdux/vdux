
# vdux

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Stateless virtual dom &lt;-&gt; Redux

## Installation

    $ npm install vdux

### Running the examples

    $ cd examples/basic && budo --live index.js -- -t babelify

## Setup

vdux takes a stateless [virtual dom](https://github.com/ashaffer/virtex), and wires it to a [redux](https://github.com/rackt/redux) store.  You call it like this:

```javascript
vdux(store, app, node)
```

From then on, when your `store` emits a state update, your new state atom will be passed to `app`, which will render into `rootNode`.

### Params

  * `store` - A redux store.
  * `app` - A pure function that takes a single argument, state, and returns a virtual-dom tree.
  * `node` - The DOM node in which to render `app`.

## DOM Events / Actions

Your event handlers are pure functions that return a value. That value is then dispatched into redux. This forms a [cycle](https://github.com/cyclejs/cycle-core) that will define your entire application in a side-effect free way:

```javascript
function counter (props) {
  return h('div', {'onClick': increment}, ['Value: ' + props.counter])
}

function increment () {
  return {
    type: 'INCREMENT'
  }
}
```

## Side-effects

Almost side-effect free, anyway. You still need to do things like issue requests. I recommend you contain these effects in your redux middleware stack. Here are some libraries / strategies for doing this:

  * [redux-effects](https://github.com/redux-effects/redux-effects)
  * [redux-thunk](https://github.com/gaearon/redux-thunk)
  * [redux-promise](https://github.com/acdlite/redux-promise)

## Ecosystem

  * [virtex](https://github.com/ashaffer/virtex) - The redux-based virtual dom library used by vdux. You don't need to use this - it's already in vdux, but you will need to add virtex middleware to your redux middleware stack.
  * [virtex-element](https://github.com/ashaffer/virtex-element) - A high-level, opionated JSX pragma for virtex nodes. You probably want to use this for getting started, but later on you may be interested in adding your own sugary element creators.
  * [virtex-dom](https://github.com/ashaffer/virtex-dom) - DOM rendering redux middleware backend for virtex. You need this if you want to be rendering DOM nodes.
  * [virtex-string](https://github.com/ashaffer/virtex-string) - String rendering redux middleware backend. Use this for server-side rendering and tests.
  * [virtex-component](https://github.com/ashaffer/virtex-component) - Lets virtex understand components. Adds nice react/deku-style components with hooks, `shouldUpdate`, and other civilized things.
  * [virtex-local](https://github.com/ashaffer/virtex-local) - Give your components local state, housed inside your redux state atom. Note that you will also need [redux-ephemeral](https://github.com/ashaffer/redux-ephemeral) mounted into your reducer for this to work.
  * [redux-ephemeral](https://github.com/ashaffer/redux-ephemeral) - Allows your reducer to manage transient local state (i.e. component local state).
  * [redux-multi](https://github.com/ashaffer/redux-multi) - Allows you to dispatch multiple actions by returning an array. This isn't strictly necessary, but it's highly recommended.

## Wiring

vdux, virtex, et. al and you are free to create your own rendering backends, JSX pragmas, component middleware, local state middleware, or any other type of middleware you want. You can intercede in any aspect of the rendering pipeline that you need by adding redux middleware. This extensibility and modularity comes at some setup cost, however. Getting started requires a bit of middleware boilerplate, but you can basically just copy/paste this to start rapidly:

```javascript
/**
 * Imports
 */

import {createStore, applyMiddleware} from 'redux'
import component from 'virtex-component'
import local from 'virtex-local'
import reducer from './reducer'
import dom from 'virtex-dom'

/**
 * Middleware
 */

const middleware = [
  // mount your component local state into 'app' in your
  // redux state atom
  local('app'),
  component,
  dom(document)
]

/**
 * Store
 */

function configureStore (initialState) {
  return applyMiddleware(...middleware)(createStore)(reducer, initialState)
}

/**
 * Exports
 */

export default configureStore
```

Assuming you are using [virtex-local](https://github.com/ashaffer/virtex-local) and you have mounted your component local state at `app` as in the example above, you will also need to install [redux-ephemeral](https://github.com/ashaffer/redux-ephemeral) into your reducer, like this:

```javascript
import combineReducers from '@micro-js/combine-reducers'
import ephemeral from 'redux-ephemeral'

export default combineReducers({
  app: ephemeral
  // ... other reducers
})
```


## License

The MIT License

Copyright &copy; 2015, Weo.io &lt;info@weo.io&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
