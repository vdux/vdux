/**
 * Imports
 */

import curryAll from '@micro-js/curry-all'
import * as actions from './actions'

/**
 * Curried actions
 */

const {
  addTodo,
  removeTodo,
  setTodoText,
  setImportant,
  setCompleted,
  setAllCompleted,
  clearCompleted,
  persistTodos,
  initializeApp
} = curryAll(actions)

/**
 * Exports
 */

export {
  addTodo,
  removeTodo,
  setTodoText,
  setImportant,
  setCompleted,
  setAllCompleted,
  clearCompleted,
  persistTodos,
  initializeApp
}
