/**
 * Imports
 */

import composeReducers from '@micro-js/compose-reducers'
import combineReducers from '@micro-js/combine-reducers'
import handleActions from '@micro-js/handle-actions'
import reduceKey from '@micro-js/reduce-key'
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

const todoReducer = handleActions({
  [setTodoText]: (todo, {text}) => ({...todo, text}),
  [setImportant]: (todo, {important}) => ({...todo, important}),
  [setCompleted]: (todo, {completed}) => ({...todo, completed})
})

// Note that these are action creator functions being
// used as keys. They have an overriden .toString()
// property that makes this work.
//
// Read more here:
// https://github.com/micro-js/create-action
const todosReducer = composeReducers(
  reduceKey((state, {payload}) => payload && payload.idx, todoReducer),
  handleActions({
    [addTodo]: (todos, {text}) => todos.concat({text, important: false, completed: false}),
    [removeTodo]: (todos, {idx}) => todos.filter((todo, i) => idx !== i),
    [setAllCompleted]: (todos, {completed}) => todos.map(todo => ({...todo, completed})),
    [clearCompleted]: (todos) => todos.filter(todo => !todo.completed)
  })
)

const urlReducer = handleActions({
  [urlDidUpdate]: (oldUrl, {url}) => url
}, '/')

/**
 * Exports
 */

export default composeReducers(
  hydrateReducer,
  combineReducers({
    todos: todosReducer,
    url: urlReducer,
    app: ephemeral
  })
)
