/**
 * Imports
 */

import {applyMiddleware, createStore} from 'redux'
import localstorage from 'redux-effects-localstorage'
import location from 'redux-effects-location'
import persist from './middleware/persist'
import events from 'redux-effects-events'
import effects from 'redux-effects'
import logger from 'redux-logger'
import reducer from './reducers'
import multi from 'redux-multi'

/**
 * Middleware
 */

const middleware = [
  multi,
  effects,
  localstorage(window.localStorage),
  events(),
  location(),
  persist,
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
