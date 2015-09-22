/**
 * Imports
 */

import {TODO_ADD, TODO_REMOVE, TODO_TOGGLE_IMPORTANT} from './actions'
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
    case TODO_TOGGLE_IMPORTANT:
      return {
        ...state,
        todos: state.todos.map((todo, idx) => idx === action.idx
            ? {...todo, important: !todo.important}
            : todo
          )
      }
  }

  return ephemeral(state, action)
}

/**
 * Exports
 */

export default reducer
