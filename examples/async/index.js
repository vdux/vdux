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
 * initialState
 */

const initialState = {
  reddit: 'reactjs',
  posts: []
}

/**
 * Initialize
 */

domready(() => vdux({
  middleware,
  reducer,
  initialState,
  app
}))

/**
 * App
 */

function app (state) {
  return <App {...state} />
}
