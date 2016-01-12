/**
 * Imports
 */

import domready from '@f/domready'
import vdux from '../../src/dom'
import reducer from './reducer'
import app from './app'

/**
 * initialState
 */

const initialState = {
  counter: 0
}

/**
 * App
 */

let hmr
domready(() => hmr = vdux({
  reducer,
  initialState,
  app
}))

/**
 * Hot module replacement
 */

if (module.hot) {
  // These two lines are waiting on https://github.com/AgentME/browserify-hmr
  // module.hot.decline()
  // module.hot.unaccepted(() => window.location.reload())
  module.hot.accept(['./reducer', './app'],
    () => hmr.replace(require('./app').default, require('./reducer').default))
}
