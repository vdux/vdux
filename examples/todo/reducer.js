/**
 * Imports
 */

import setProp from '@micro-js/set-prop'
import composeReducers from '@micro-js/compose-reducers'
import combineReducers from '@micro-js/combine-reducers'
import handleActions from '@micro-js/handle-actions'
import ephemeral from 'redux-ephemeral'
import {
  addTodo, removeTodo, setTodoText,
  setImportant, setCompleted, setAllCompleted,
  clearCompleted, urlDidUpdate, hydrateState
} from './actions'

/**
 * Reducers
 */

const hydrateReducer = handleActions({
  [hydrateState]: (state, newState) => newState
})

// Note that these are action creator functions being
// used as keys. They have an overriden .toString()
// property that makes this work.
//
// Read more here:
// https://github.com/micro-js/create-action
const todoReducer = handleActions({
  [setTodoText]: (todos, {idx, text}) => setProp([idx, 'text'], todos, text),
  [setImportant]: (todos, {idx, important}) => setProp([idx, 'important'], todos, important),
  [setCompleted]: (todos, {idx, completed}) => setProp([idx, 'completed'], todos, completed),
  [addTodo]: (todos, {text}) => todos.concat({text, important: false, completed: false}),
  [removeTodo]: (todos, {idx}) => todos.filter((todo, i) => idx !== i),
  [setAllCompleted]: (todos, {completed}) => todos.map(todo => ({...todo, completed})),
  [clearCompleted]: (todos) => todos.filter(todo => !todo.completed)
})

const urlReducer = handleActions({
  [urlDidUpdate]: (oldUrl, {url}) => url
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
