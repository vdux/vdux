/**
 * Imports
 */

import {
  TODO_ADD,
  TODO_REMOVE,
  TODO_SET_TEXT,
  TODO_SET_IMPORTANT,
  TODO_SET_COMPLETED,
  SET_ALL_COMPLETED,
  CLEAR_COMPLETED,
  URL_DID_UPDATE,
  HYDRATE_STATE
} from './actions'

import ephemeral from 'redux-ephemeral'

/**
 * Reducer
 */

function reducer (state, action) {
  switch (action.type) {
    case HYDRATE_STATE: {
      return {
        ...state,
        ...action.payload
      }
    }
    case TODO_ADD: {
      const {text} = action.payload
      return {
        ...state,
        todos: [...state.todos, {text, important: false, completed: false}]
      }
    }
    case TODO_REMOVE: {
      return {
        ...state,
        todos: state.todos.filter((todo, idx) => idx !== action.payload.idx)
      }
    }
    case TODO_SET_TEXT: {
      const {idx, text} = action.payload

      return {
        ...state,
        todos: updateArrayItem(state.todos, idx, todo => ({...todo, text}))
      }
    }
    case TODO_SET_IMPORTANT: {
      const {idx, important} = action.payload

      return {
        ...state,
        todos: updateArrayItem(state.todos, idx, todo => ({...todo, important}))
      }
    }
    case TODO_SET_COMPLETED: {
      const {idx, completed} = action.payload

      return {
        ...state,
        todos: updateArrayItem(state.todos, idx, todo => ({...todo, completed}))
      }
    }
    case SET_ALL_COMPLETED: {
      const {completed} = action.payload

      return {
        ...state,
        todos: state.todos.map(todo => ({...todo, completed}))
      }
    }
    case CLEAR_COMPLETED: {
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      }
    }
    case URL_DID_UPDATE: {
      return {
        ...state,
        url: action.payload.url
      }
    }
  }

  return ephemeral(state, action)
}

/**
 * Utilities
 */

function updateArrayItem (arr, idx, fn) {
  return arr.map((item, curIdx) =>
    idx === curIdx
      ? fn(item)
      : item)
}

/**
 * Exports
 */

export default reducer
