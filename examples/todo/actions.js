/**
 * Types
 */

const TODO_ADD = 'TODO_ADD'
const TODO_REMOVE = 'TODO_REMOVE'
const TODO_SET_IMPORTANT = 'TODO_SET_IMPORTANT'
const TODO_SET_COMPLETED = 'TODO_SET_COMPLETED'

/**
 * Action creators
 */

function addTodo (text) {
  return {
    type: TODO_ADD,
    payload: {
      text
    }
  }
}

function removeTodo (idx) {
  return {
    type: TODO_REMOVE,
    payload: {
      idx
    }
  }
}

function setImportant (idx, important) {
  return {
    type: TODO_SET_IMPORTANT,
    payload: {
      idx,
      important
    }
  }
}

function setCompleted (idx, completed) {
  return {
    type: TODO_SET_COMPLETED,
    payload: {
      idx,
      completed
    }
  }
}

/**
 * Exports
 */

export default {
  // Action creators
  addTodo,
  removeTodo,
  setImportant,
  setCompleted,

  // Action types
  TODO_ADD,
  TODO_REMOVE,
  TODO_SET_IMPORTANT,
  TODO_SET_COMPLETED
}
