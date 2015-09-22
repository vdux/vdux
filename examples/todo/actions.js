/**
 * Types
 */

const TODO_ADD = 'TODO_ADD'
const TODO_REMOVE = 'TODO_REMOVE'
const TODO_TOGGLE_IMPORTANT = 'TODO_TOGGLE_IMPORTANT'

/**
 * Action creators
 */

function addTodo (text) {
  return {
    type: TODO_ADD,
    text
  }
}

function removeTodo (idx) {
  return {
    type: TODO_REMOVE,
    idx
  }
}

function toggleTodoImportant (idx) {
  return {
    type: TODO_TOGGLE_IMPORTANT,
    idx
  }
}

/**
 * Exports
 */

export default {
  // Action creators
  addTodo,
  removeTodo,
  toggleTodoImportant,

  // Action types
  TODO_ADD,
  TODO_REMOVE,
  TODO_TOGGLE_IMPORTANT
}
