
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

## Middleware

vdux requires a fair bit of middleware to work correctly. To make this easier on you, there is a preset DOM middleware stack: [vdux-preset-client](https://github.com/ashaffer/vdux-preset-client). This gives you: components, local state, and DOM rendering. You use it like this:

```javascript
import vdux from 'vdux'
import client from 'vdux-preset-client'
import reducer from './reducer'
import thunk from 'redux-thunk'
import app from './app'

/**
 * Your application's redux middleware
 */

const middleware = [
  thunk,
  // .. other middleware
]

const initialState = {}
const configStore = client(...middleware)
const store = configStore(reducer, initialState)

document.addEventListener('DOMContentLoaded', () => vdux(
  store,
  app,
  document.body
))
```

If you'd like to use a custom middleware stack, you should look at [vdux-preset-client](https://github.com/ashaffer/vdux-preset-client) and see how it works (it's very simple).

## License

The MIT License

Copyright &copy; 2015, Weo.io &lt;info@weo.io&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
