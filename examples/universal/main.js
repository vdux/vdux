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

function boot (vdux, vtree) {
  return vdux({
    reducer,
    initialState,
    app,
    vtree
  })
}

/**
 * Exports
 */

export default boot
