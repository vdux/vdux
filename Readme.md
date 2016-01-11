
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

ready(() => vdux({
  reducer,
  initialState,
  app: state => <Counter value={state.counter} />
}))

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

vdux is an opionated, higher-level abstraction over [redux](https://github.com/rackt/redux) and [virtex](https://github.com/ashaffer/virtex). To initialize it, it takes a single object containing several parameters:

  * `middleware` - An array containing redux middleware you want to use. Defaults to `[]`.
  * `reducer` - Your root redux reducer
  * `initialState` - The initial state atom for your application. Defaults to `{}`.
  * `app` - A function that accepts `state` and returns a virtual node tree
  * `node` - The root node you want to render `app` into. Defaults to `document.body`.

Once you call vdux with these parameters, you're done. Your application's primary state <-> UI loop is established. From this point forward, nothing your code does will be imperative - every function will accept parameters and return a value, and that's it.

## JSX / Hyperscript

vdux's JSX pragma is accessible on `vdux/element`. E.g.

```javascript
import element from 'vdux/element'

export default function render () {
  return <div>Hello world!</div>
}
```

### babelrc

Put this in your babelrc and `npm install babel-plugin-transform-react-jsx` to make JSX work with `element`.

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

### events

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
  * `ref` - Direct an action to another component's reducer (see the local state section)
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

  * `beforeMount(model)` - Called before the component is rendered in the DOM for the first time. Called only once.
  * `beforeUpdate(prev, next)` - Called before a change to the component's model (not including the initial render).
  * `beforeRender(model)` - Called right before any render (including the initial render).
  * `afterUpdate(prev, next)` - Called after a change to the component's model (not including the initial render).
  * `afterMount(model)` - Called after the component is first rendered into the DOM. Called only once.

## Local state

In vdux, all of your state is kept in your global redux state atom under the `ui` property. In order to support component local state, your component may export two additional functions:

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

function render ({local, state}) {
  return <div onClick={local(increment)}>Counter: {state.counter}</div>
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

## Server-side rendering

...Still working on this section...but you can check out the super basic universal example if you want to experiment with it.

## Side-effects

Almost side-effect free, anyway. You still need to do things like issue requests. I recommend you contain these effects in your redux middleware stack. Here are some libraries / strategies for doing this:

  * [redux-effects](https://github.com/redux-effects/redux-effects)
  * [redux-thunk](https://github.com/gaearon/redux-thunk)
  * [redux-promise](https://github.com/acdlite/redux-promise)

## Suggested middleware

  * [redux-multi](https://github.com/ashaffer/redux-multi) - Highly recommended, without this, you'll only be able to return one action at a time, which is severely limiting. Use this to return arrays of actions to be dispatched.

## Submodules / Ecosystem

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

## License

The MIT License

Copyright &copy; 2015, Weo.io &lt;info@weo.io&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
