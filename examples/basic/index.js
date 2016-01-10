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

domready(() => vdux({
  reducer,
  initialState,
  app
}))
