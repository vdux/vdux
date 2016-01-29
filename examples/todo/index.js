/**
 * Imports
 */

import middleware from './middleware'
import element from '../../element'
import domready from '@f/domready'
import reducer from './reducers'
import vdux from '../../src/dom'
import App from './app'

/**
 * initialState
 */

const initialState = {
  todos: []
}

/**
 * Initialize
 */

domready(() => vdux({
  middleware,
  reducer,
  initialState,
  app,
  node: document.getElementById('app')
}))

/**
 * App
 */

function app (state) {
  return <App todos={state.todos} url={state.url} />
}
