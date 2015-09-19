/**
 * Imports
 */

import {createStore, applyMiddleware} from 'redux'
import reducer from './reducer'
import effects from 'redux-effects'
import fetch from 'redux-effects-fetch'
import events from 'redux-effects-events'
import dispatchedAt from './middleware/dispatchedAt'
import multi from 'redux-multi'
import logger from 'redux-logger'

/**
 * Middleware
 */

 const middleware = [
   multi,
   effects,
   events(),
   fetch,
   dispatchedAt,
   logger
 ]

/**
 * Store
 */

function configureStore (initialState) {
  return applyMiddleware(...middleware)(createStore)(reducer, initialState)
}

/**
 * Exports
 */

export default configureStore
