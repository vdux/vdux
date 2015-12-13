/**
 * Imports
 */

import handleActions from '@micro-js/handle-actions'
import replace from '@micro-js/reduce-replace'
import {hydrateState} from '../actions'

/**
 * Hydrate state from local storage
 */

const hydrateReducer = handleActions({
  [hydrateState]: replace()
})

/**
 * Exports
 */

export default hydrateReducer
