/**
 * Imports
 */

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

function boot (vdux) {
  return vdux({
    reducer,
    initialState,
    app
  })
}

/**
 * Exports
 */

export default boot
