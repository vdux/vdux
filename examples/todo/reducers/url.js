/**
 * Imports
 */

import handleActions from '@micro-js/handle-actions'
import replace from '@micro-js/reduce-replace'
import {urlDidUpdate} from '../actions'

/**
 * Url reducer
 */

const urlReducer = handleActions({
  [urlDidUpdate]: replace()
}, '/')

/**
 * Exports
 */

export default urlReducer
