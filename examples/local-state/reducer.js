/**
 * Imports
 */

import {TODO_ADD, TODO_REMOVE, TODO_SET_IMPORTANT} from './actions'
import ephemeral from 'redux-ephemeral'

/**
 * Reducer
 */

function reducer (state, action) {
  switch (action.type) {
    case TODO_ADD:
      return {
        ...state,
        todos: [...state.todos, {text: action.text, important: false}]
      }
    case TODO_REMOVE:
      return {
        ...state,
        todos: state.todos.filter((todo, idx) => idx !== action.idx)
      }
    case TODO_SET_IMPORTANT:
      return {
        ...state,
        todos: state.todos
          .reduce(
            (acc, todo, idx) => acc.concat(
              idx === action.idx
                ? {...todo, important: true}
                : todo, [])
          )
      }
  }

  console.log('action', action)
  return ephemeral(state, action)
}

/**
 * Exports
 */

export default reducer
