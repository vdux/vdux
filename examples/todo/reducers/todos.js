/**
 * Imports
 */

import handleActions from '@micro-js/handle-actions'
import composeReducers from '@micro-js/compose-reducers'
import reduceKey from '@micro-js/reduce-key'
import rfilter from '@micro-js/reduce-filter'
import rmap from '@micro-js/reduce-map'
import concat from '@micro-js/concat'
import {
  addTodo, removeTodo, setTodoText, setImportant,
  setCompleted, setAllCompleted, clearCompleted
} from '../actions'

/**
 * Todo list reducer
 */

const todoReducer = handleActions({
  [setTodoText]: updateProp('text'),
  [setImportant]: updateProp('important'),
  [setCompleted]: updateProp('completed')
})

// Note that these are action creator functions being
// used as keys. They have an overriden .toString()
// property that makes this work.
//
// Read more here:
// https://github.com/micro-js/create-action
const todosReducer = composeReducers(
  reduceKey(getIndex, todoReducer),
  handleActions({
    [addTodo]: concat,
    [removeTodo]: rfilter((todo, {idx}, i) => i !== idx),
    [setAllCompleted]: rmap(updateProp('completed')),
    [clearCompleted]: rfilter(notCompleted)
  })
)

/**
 * Helpers
 */

function updateProp (prop) {
  return (item, payload) => ({...item, [prop]: payload[prop]})
}

function notCompleted (todo) {
  return !todo.completed
}

function getIndex (state, {payload}) {
  return payload && payload.idx
}

/**
 * Exports
 */

export default todosReducer
