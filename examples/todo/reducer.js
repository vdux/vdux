/**
 * Imports
 */

import setProp from '@micro-js/set-prop'
import composeReducers from '@micro-js/compose-reducers'
import combineReducers from '@micro-js/combine-reducers'
import handleActions from '@micro-js/handle-actions'
import ephemeral from 'redux-ephemeral'
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


/**
 * Reducers
 */

const hydrateReducer = handleActions({
  [HYDRATE_STATE]: (state, newState) => newState
})

const todoReducer = handleActions({
  [TODO_SET_TEXT]: (todos, {idx, text}) => setProp([idx, 'text'], todos, text),
  [TODO_SET_IMPORTANT]: (todos, {idx, important}) => setProp([idx, 'important'], todos, important),
  [TODO_SET_COMPLETED]: (todos, {idx, completed}) => setProp([idx, 'completed'], todos, completed),
  [TODO_ADD]: (todos, {text}) => todos.concat({text, important: false, completed: false}),
  [TODO_REMOVE]: (todos, {idx}) => todos.filter((todo, i) => idx !== i),
  [SET_ALL_COMPLETED]: (todos, {completed}) => todos.map(todo => ({...todo, completed})),
  [CLEAR_COMPLETED]: (todos) => todos.filter(todo => !todo.completed)
})

const urlReducer = handleActions({
  [URL_DID_UPDATE]: (oldUrl, {url}) => url
}, '/')

/**
 * Exports
 */

export default composeReducers(
  hydrateReducer,
  combineReducers({
    todos: todoReducer,
    url: urlReducer,
    app: ephemeral
  })
)
