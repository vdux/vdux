/**
 * Imports
 */

import middleware from './middleware'
import element from '../../element'
import domready from '@f/domready'
import vdux from '../../src/dom'
import reducer from './reducer'
import App from './app'

/**
 * Initialize
 */

domready(() => vdux({
  middleware,
  reducer,
  app,
  node: document.body
}))

/**
 * App
 */

function app (state) {
  return <App {...state} />
}
