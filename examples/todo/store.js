/**
 * Imports
 */

import {createStore, applyMiddleware} from 'redux'
import reducer from './reducer'
import effects from 'redux-effects'
import events from 'redux-effects-events'
import location from 'redux-effects-location'
import localstorage from 'redux-effects-localstorage'
import persist from './middleware/persist'
import multi from 'redux-multi'
import logger from 'redux-logger'

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
