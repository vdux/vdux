/**
 * Imports
 */

import {createStore, applyMiddleware} from 'redux'
import reducer from './reducer'
import logger from 'redux-logger'
import multi from 'redux-multi'
import effects from 'redux-effects'
import events from 'redux-effects-events'
import location from 'redux-effects-location'
import fetch from 'redux-effects-fetch'

/**
 * Store
 */

const middleware = [
  multi,
  effects,
  fetch,
  events(),
  location()
]

function configureStore(initialState) {
  return applyMiddleware(...middleware)(createStore)(reducer, initialState)
}

/**
 * Exports
 */

export default configureStore
