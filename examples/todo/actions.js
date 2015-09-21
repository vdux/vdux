/**
 * Types
 */

const TODO_ADD = 'TODO_ADD'
const TODO_REMOVE = 'TODO_REMOVE'
const TODO_SET_IMPORTANT = 'TODO_STAR'

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

function markTodoImportant (idx) {
  return {
    type: TODO_SET_IMPORTANT,
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
  markTodoImportant,

  // Action types
  TODO_ADD,
  TODO_REMOVE,
  TODO_SET_IMPORTANT
}
