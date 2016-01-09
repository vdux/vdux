/**
 * Imports
 */

import wrapReducer from '../../../src/wrapReducer'
import composeReducers from '@f/compose-reducers'
import combineReducers from '@f/combine-reducers'
import hydrateReducer from './hydrate'
import todosReducer from './todos'
import urlReducer from './url'

/**
 * Exports
 */

export default wrapReducer(composeReducers(
  hydrateReducer,
  combineReducers({
    todos: todosReducer,
    url: urlReducer
  })
))
