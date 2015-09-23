/**
 * Imports
 */

import {
  TODO_ADD,
  TODO_REMOVE,
  TODO_SET_IMPORTANT,
  TODO_SET_COMPLETED
} from './actions'
import ephemeral from 'redux-ephemeral'

/**
 * Reducer
 */

function reducer (state, action) {
  switch (action.type) {
    case TODO_ADD:
      return {
        ...state,
        todos: [...state.todos, {text: action.payload.text, important: false}]
      }
    case TODO_REMOVE:
      return {
        ...state,
        todos: state.todos.filter((todo, idx) => idx !== action.payload.idx)
      }
    case TODO_SET_IMPORTANT:
      return {
        ...state,
        todos: state.todos.map((todo, idx) => idx === action.payload.idx
            ? {...todo, important: action.payload.important}
            : todo
          )
      }
    case TODO_SET_COMPLETED:
      return {
        ...state,
        todos: state.todos.map((todo, idx) => idx === action.payload.idx
            ? {...todo, completed: action.payload.completed}
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
