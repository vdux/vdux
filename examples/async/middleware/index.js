/**
 * Imports
 */

import dispatchedAt from './dispatchedAt'
import events from 'redux-effects-events'
import fetch from 'redux-effects-fetch'
import effects from 'redux-effects'
import logger from 'redux-logger'
import multi from 'redux-multi'

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
 * Exports
 */

export default middleware
