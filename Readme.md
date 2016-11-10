
# vdux

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Stateless virtual dom &lt;-&gt; Redux.

## Installation

    $ npm install vdux

### Running the examples

    $ cd examples/basic && budo --live index.js -- -t babelify

## Philosophy

vdux is an opinionated bridge between a [virtual DOM library](https://github.com/vdux/virtex) and [redux](https://github.com/reactjs/redux). It takes the react/redux philosophy and flips it on its head. Vdux believes that *all* state should be component-local and that the component is the sole, fundamental building block of your application. Components may bring their own middleware and ought to control the application lifecycle in its entirety.

Why all local state? Because almost all state has some sort of lifecycle. If you have global state, put it in your top-most component. The thing that I think mostly drove the concept of global state was server-side rendering. But that is solved by vdux's other innovation: all your local state is stored in a single, accessible, immutable state atom. You can reconstitute your *entire* state tree from the server on the client, with no exceptions. You can do that very simply, like this:

```js
function * serverRender () {
  const {state, html} = yield vdux(<App />)

  this.body = `<html>
    <head>
      <script src='/vdux.js'></script>
      <script src='/app.js'></script>
      <script>
        vdux(() => <App />, {
          initialState: ${JSON.stringify(state),
          prerendered: true
        })
      </script>
    </head>
    <body>
      ${html}
    </body>
  </html>`
}
```

## Minimal counter example

```javascript
import vdux from 'vdux/dom'
import {component, element} from 'vdux'

/**
 * Initialize the app
 */

vdux(() => <App />)

/**
 * App
 */

const App = component({
  render ({state, actions}) {
    return <div onClick={actions.increment}>Value: {state.value}</div>
  },

  reducer: {
    increment: state => ({
      value: state.value + 1
    })
  }
}
```

## Usage

vdux is an opionated, higher-level abstraction over [redux](https://github.com/rackt/redux) and [virtex](https://github.com/ashaffer/virtex). You initialize it in the browser like this:

```js
import vdux from 'vdux/dom'
import App from 'components/App'

vdux(() => <App />)
```

This returns an object with a few functions:

  * `dispatch(action)` - Manually dispatch an action. If you have outside event sources or want to dispatch manually for testing purposes, use this.
  * `getState()` - Returns the current redux state atom.
  * `stop()` - Stop the application cycle.
  * `forceRerender()` - Forces a full rerender. Useful for hot reloading.

## JSX / Hyperscript

```javascript
import {element} from 'vdux'

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

Your event handlers are generator functions or state reducers specified by your component. They will be specified in the `controller` and `reducer` properties, respectively.

```javascript
import {component, element} from 'vdux'
import sleep from '@f/sleep'

export default component({
  render ({state, actions}) {
    return (
      <div onClick={actions.increment}>Value: {state.counter}</div>
      <button onClick={actions.incrementAsync(100)}>Increment Async</button>
    )
  },

  controller: {
    * incrementAsync ({actions}, milliseconds) {
      yield sleep(milliseconds)
      yield actions.increment()
    }
  },

  reducer: {
    increment: state => ({
      state: state.value + 1
    })
  }
})
```

### Autocurrying

All your actions will autocurry indefinitely. That means that you can pass down a curried action like this: `updateEntity(id)`, and then the component below you can add more parameters to it. Internally, the arguments you are accumulating will be exposed on the function that's passed down. This means that vdux can diff your actions in a meaningful way, so passing functions down through many layers of your application will not create performance problems.

### Event names

Also of note, vdux is unopinionated about the casing of event handler prop names. If you are wondering if it's `onKeyDown` or `onKeydown`, both/all will work, even `ONKEYDOWN`, or `onkeydown`. As long as it matches the case-insensitive regex `on(?:domEventNames.join('|'))`, it'll work. If you want to know whether an event you want is included, check out [dom-events](https://github.com/micro-js/dom-events) for the complete list - and if one you want isn't there, just send a PR to that module.

## Events

If you want to do more than one thing in response to an event, you can pass an array of handlers, like this:

```javascript
function render () {
  return <div onClick={[actions.fetchPosts, actions.closeDropdown]}></div>
}
```

The return values of both handlers will be dispatched into redux. There is also a set of special syntax for keyboard related events - you may pass an object containing the particular [keychords](https://github.com/micro-js/keychord) you want to select for. E.g.

```javascript
function render () {
  return <input onKeydown={{enter: actions.submit, esc: actions.cancel, 'shift+enter': actions.newline}} />
}
```

### Decoders

By default, most of your event handlers will receive no arguments (unless you curry them) with the exception of the `input` and `change` events, which by default receive `event.target.value`. However, if you need to access something else, or if you want to `stopPropagation/preventDefault`, you can use a 'decoder'. This is a concept borrowed from [Elm](https://github.com/elm-lang). Decoders get access to the raw event and can transform it and return something suitable for consumption by your handler. vdux comes with a number of default decoders:

  * decodeRaw - Passes `event`
  * decodeNode - Passes `e.target`
  * decodeValue - Passes `e.target.value`
  * decodeFiles - Passes `e.target.files`
  * decodeMouse - Passes `{clientX: e.clientX, clientY: e.clientY}`

You can import any of these from `vdux` and use them like this:

```
component({
  render ({actions}) {
    return (
      <div onMouseMove={decodeMouse(actions.updateCoords)} style={{width: '400px', height: '400px'>
        x: {state.clientX}
        y: {state.clientY}
      </div>
    )
  },

  reducer: {
    updateCoords: (state, coords) => coords
  }
})
```

### Custom decoders

If you need to implement your own custom decoder, you can import `decoder` from vdux, like this:

```js
import {decoder} from 'vdux'

const decodeRelatedTarget = decoder(e => e.relatedTarget)
```

### stopPropagation / preventDefault

You can do this one of two ways. You can use `decodeRaw` and call these methods yourself on the raw event, or you can use the special declarative handlers vdux provides you. Example:

```js
import {component, element, stopPropagation} from 'vdux'

component({
  render () {
    return <button onClick={[actions.handleClick, stopPropagation]} />
  }
})
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

## Components

Components in vdux look a lot like components in other virtual dom libraries. You have a `render`, and some lifecycle hooks. Your `render` function receives a `model` that looks like this:

  * `props` - The arguments passed in by your parent
  * `children` - The child elements of your component
  * `state` - The state of your component
  * `context` - A context object specified by your root component
  * `actions` - Directs an action to the current component's reducer (see the local state section)
  * `path` - The dotted path to your component in the DOM tree. For the most part, you probably don't need to worry about this.

### Hooks

  * `onCreate` - When the component is created. Receives `model`.
  * `onUpdate` - When the model changes. Receives `prev` and `next` models.
  * `afterRender` - Called after any render. Passed the model and the root DOM node of the component. Runs only in the browser. It is recommended that you avoid using it as much as possible - but it is necessary in a few cases like positioning elements relative to one another.
  * `onRemove` - When the component is removed. Receives `model`.

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

### Context

Sometimes it's too cumbersome to pass everything down from the top of your app. Things like the current url, logged in user, or theme might be too ubiquitous at the leaves of your tree to warrant manually propagating them down via props. For these cases, there is a way out: Context. Context let's you define an object at the top level that any component in the tree can tap into. It is specified by the top-most component of your app. *Only* your root component may specify a `getContext` function. There is no layering of context.

```js

/**
 * <App/>
 */

export default component({
  getContext ({actions, state}) {
    return {
      url: state.url,
      currentUser: state.currentUser,
      logUserIn: actions.logUserIn
      logUserOut: actions.logUserOut
    }
  },

  render ({state}) {
    return <Router url={state.url} />
  }

  // ...
})
```

From then on, `context` will be available in every component's model. Any time context changes, the entire application will be rerendered, so do not put things in there that change often. Note: it is particularly useful to put actions that manipulate your top-level state into your context. This allows you to pass global actions down to your lower-level components in a clean way.

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
const {forceRerender} = vdux(() => <App />)

if (module.hot) {
  module.hot.accept(['./app'], () => {
    App = require('./app')
    forceRerender()
  })
}
```

## Server-side rendering

Server-side rendering uses `vdux/string`. And its interface is essentially the same as the DOM renderer:

```js
import vdux from 'vdux/string'

function * render (req) {
  const {html, state} = yield vdux(() => <App req={req} />)
  this.body = page(html, state)
}
```

### Delayed server-side rendering

If you just use the code above, your app will simply return its initial render. However, often you may want to grab the current user and other information from your API/DB server, and this may take an indeterminate amount of time before you decide that the app is 'ready' to be rendered. If you want to do this, you need to pass `awaitReady` into vdux's second parameter, like this:

```js
import vdux from 'vdux/string'

function * render (req) {
  const {html, state} = yield vdux(() => <App req={req} />, {awaitReady: true})
  this.body = page(html, state)
}
```

This will cause the `yield` to block until the `appReady` action is dispatched. You can do that like this:

```js
import fetchMw, {fetch} from 'redux-effects-fetch'
import {appReady, component, element} from 'vdux'
import InternalApp from 'components/InternalApp'
import Loading from 'components/Loading'
import cookie from 'cookie'

/**
 * <App/>
 */

export default component({
  initialState ({props}) {
    if (props.req) {
      const cookieObj = cookieParser.parse(props.req.headers.cookie || '')

      return {
        currentUrl: props.req.url,
        authToken: cookieObj.authToken || ''
      }
    }
  },

  onCreate ({actions}) {
    return actions.fetchUser()
  }

  render ({state}) {
    return state.user ? <InternalApp/> : <Loading/>
  },

  onUpdate (prev, next) {
    if (!prev.state.user && next.state.user) {
      return appReady()
    }
  },

  middleware: [
    fetch
  ],

  controller: {
    * fetchUser ({state, props}) {
      if (!state.user && !state.userLoading && props.req) {
        const userId = cookie(props.req.headers['Cookie'])
        yield actions.userLoading()
        const user = yield fetch(`/user/${userId}`, {
          headers: {
            Authentication: 'Bearer ' + state.authToken
          }
        })
        yield actions.userLoaded(user)
      }
    }
  },

  reducer: {
    userLoading: () => ({userLoading: true}),
    userLoaded: (state, user) => ({
      userLoading: false,
      user
    })
  }
})
```

### Middleware

Your components may also specify custom middleware. This can enable them to run side-effects in a functionally pure way. Your component middleware will receive all the same things that redux middleware does a `getContext` function to retrieve the local context. Additionally the `getState` function that the middleware receives will be the state of the local component that it was installed in.

Your middleware will receive any actions yielded by your controller methods, and they will receive them first. This means that you can use your middleware to debounce your actions or otherwise transform them, or simply enable new side-effectful actions. An example of debouncing/throttling middleware is [redux-timing](https://github.com/ashaffer/redux-timing).

#### Different middleware for different environments

You can specify your middleware as an array, but you can also specify an object with different environment keys, like this:

```
middleware: {
  node: [
    // Node-specific middleware
  ],

  browser: [
    // Browser-specific middleware
  ],

  shared: [
    // Shared middleware
  ]
}
```

### Components

Take a look at the org [vdux-components](https://github.com/vdux-components) for more.

  * [ui](https://github.com/vdux-components/ui) - Large stateless kit of UI components
  * [containers](https://github.com/vdux-components/containers) - Stateful wrappers around all of the vdux-ui components that add some features like `hoverProps`, etc..
  * [delay](https://github.com/vdux-components/delay) - Delay the rendering of child components, or execution of an action for a declaratively specified period.
  * [hover](https://github.com/vdux-components/hover) - Hover component

## License

The MIT License

Copyright &copy; 2015, Weo.io &lt;info@weo.io&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
