/**
 * Imports
 */

import multi from 'redux-multi'
import logger from 'redux-logger'
import effects from 'redux-effects'
import timeout from 'redux-effects-timeout'

/**
 * Middleware
 */

const middleware = [
  multi,
  effects,
  timeout(),
  // logger({predicate: (getState, {meta}) => !meta || !meta.nolog})
]

/**
 * Exports
 */

export default middleware
