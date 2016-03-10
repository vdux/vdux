/**
 * Imports
 */

import location from 'redux-effects-location'
import events from 'redux-effects-events'
import fetch from 'redux-effects-fetch'
import effects from 'redux-effects'
import logger from 'redux-logger'
import multi from 'redux-multi'

/**
 * Store
 */

const middleware = [
  multi,
  effects,
  fetch,
  events(),
  location(),
  logger()
]

/**
 * Exports
 */

export default middleware
