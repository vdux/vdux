/**
 * Imports
 */

import {createStore, applyMiddleware} from 'redux'
import reducer from './reducer'
import effects from 'redux-effects'
import fetch from 'redux-effects-fetch'
import multi from 'redux-multi'

/**
 * Middleware
 */

 const middleware = [
   multi,
   effects,
   fetch
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
