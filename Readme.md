
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

Your event handlers are pure functions that return a value. That value is then dispatched into redux. This forms a [cycle](https://github.com/cyclejs/cycle-core) that will define your entire application in a side-effect free way.

Using hyperscript:

```javascript
import h from 'virtex-element'

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
import element from 'virtex-element'

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

## Components

Components in vdux are handled by middleware. The de-facto solution is: [virtex-component](https://github.com/ashaffer/virtex-component). It gives you `render`, some hooks and `shouldUpdate`. You may also export stateless function components, just like [react](https://github.com/facebook/react) and [deku](https://github.com/dekujs/deku).

Each `render` call receives a `model`. Other middleware may augment your model, but by itself [virtex-component](https://github.com/ashaffer/virtex-component) gives you:

  * `props` - The arguments passed in by your parent. E.g. `<Counter color="blue" />` produces props of: `{color: "blue"}`.
  * `children` - The child elements of your component. E.g. `<Dropdown><li>item</li></Dropdown>`. Receives children of: `[<li>item</li>]`
  * `path` - The dotted path to your component in the DOM tree. E.g. `0.1.4` (these numbers represent the index of your component into the list at each layer of the DOM tree. These indices will be replaced by keys if you use a `key` prop in one of your component's ancestors). For the most part, you probably don't need to worry about this yet.

### shouldUpdate

By default, this is taken care of for you. [virtex-component](https://github.com/ashaffer/virtex-component) assumes that your data is immutable, and will do a shallow equality check on `props` and `children` to decide if your component needs to re-render. If you want to implement your own, it works like this (this is the one [virtex-component](https://github.com/ashaffer/virtex-component) uses):

```
function shouldUpdate (prev, next) {
  return !arrayEqual(prev.children, next.children) || !objectEqual(prev.props, next.props)
}
```

Where `prev` is the previous model and `next` is the next model.

### Hooks

  * `beforeMount(model)` - Called before the component is rendered in the DOM for the first time. Called only once.
  * `beforeUpdate(prev, next)` - Called before a change to the component's model (not including the initial render).
  * `beforeRender(model)` - Called right before any render (including the initial render).
  * `afterUpdate(prev, next)` - Called after a change to the component's model (not including the initial render).
  * `afterMount(model)` - Called after the component is first rendered into the DOM. Called only once.

## Local state

Like components, local state is handled by middleware. Here, opinions diverge quite a bit on what the best practices are. vdux was designed specifically to address this issue - and can support any/all major philosophies on this subject. As I see them, they are:

  * True local state (what React does)
  * Single state cursor with manual propagation (e.g. [react-cursor](https://github.com/dustingetz/react-cursor))
  * Monadic pseudo-local state (e.g. [virtex-local](https://github.com/ashaffer/virtex-local))

vdux & [virtex](https://github.com/ashaffer/virtex) were designed expressly to make the third of these possible, so that is what i'll discuss here. What that means is just that all of your state is kept in your global redux state atom, and your local state middleware will pluck out the appropriate state object from the global state atom and pass it to you whenever your component needs it, keeping your rendering tree functionally pure. If you put [virtex-local](https://github.com/ashaffer/virtex-local) in your middleware stack, your components models will be augmented with some new properties:

  * `state` - Your component's state
  * `local` - A curried function that directs actions to your component.
  * `ref` - Used for inter-component communication, and analogous to React's refs.

Your component may also now export some new functions:

  * `initialState` - Receives `model` and returns the starting state for your component.
  * `reducer` - A reducing function for your component's state. Receives `(state, action)` and returns a new state.

### local

The `local` function is how you update the state of your component. It accepts a function that returns an action, and returns a function that creates an action directed to the current component. That's may be a bit hard to digest, so here's an example:

```javascript
function initialState () {
  return {
    value: 0
  }
}

function render ({local, props}) {
  return <div onClick={local(increment)}>Counter: {props.counter}</div>
  )
}

function counter () {
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

### ref

Ref is how you talk to other components in a functional way. It has two functions on it

  * `as(name)` - Creates an aliased reference to a child component.
  * `to(name, fn)` - Directs an action (returned by `fn`) to the component aliased as `name`.

Here's an example:

```javascript
import Dropdown from 'components/dropdown'

function render ({ref}) {
  return (
    <button onClick={ref.to('dropdown', Dropdown.open)}>Open Dropdown</button>
    <Dropdown ref={ref.as('dropdown')}>
      <li>item</li>
    </Dropdown>
  )
}
```

In dropdown.js you'd just export a plain `open` action creator function, like this:

```javascript
function open () {
  return {
    type: 'OPEN'
  }
}

function reducer (state, action) {
  if (action.type === 'OPEN') {
    return {
      ...state,
      open: true
    }
  }

  return state
}

export default {
  open,
  reducer
}
```

Internally, all `ref.to` is doing is using `<Dropdown/>`'s `local` function to send it a message in the same way it sends actions to itself.

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

## Server-side rendering

...Still working on this section...

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

## License

The MIT License

Copyright &copy; 2015, Weo.io &lt;info@weo.io&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
