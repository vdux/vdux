/**
 * Imports
 */

import domready from '@f/domready'
import vdux from '../../src/dom'
import reducer from './reducer'
import _app from './app'

/**
 * initialState
 */

const initialState = {
  counter: 0
}

/**
 * App
 */

let app = _app
const {subscribe, render, replaceReducer} = vdux({reducer, initialState})

domready(() => {
  subscribe(state => {
    render(app(state))
  })
})

/**
 * Hot module replacement
 */

if (module.hot) {
  module.hot.accept(['./reducer', './app'], () => {
    replaceReducer(require('./reducer').default)
    app = require('./app').default
  })
}
