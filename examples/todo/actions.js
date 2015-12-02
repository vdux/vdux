/**
 * Imports
 */

import {bind} from 'redux-effects'
import {bindUrl} from 'redux-effects-location'
import {setItem, getItem} from 'redux-effects-localstorage'

/**
 * Types
 */

const TODO_ADD = 'TODO_ADD'
const TODO_REMOVE = 'TODO_REMOVE'
const TODO_SET_TEXT = 'TODO_SET_TEXT'
const TODO_SET_IMPORTANT = 'TODO_SET_IMPORTANT'
const TODO_SET_COMPLETED = 'TODO_SET_COMPLETED'
const SET_ALL_COMPLETED = 'SET_ALL_COMPLETED'
const CLEAR_COMPLETED = 'CLEAR_COMPLETED'
const URL_DID_UPDATE = 'URL_DID_UPDATE'
const HYDRATE_STATE = 'HYDRATE_STATE'

/**
 * Vars
 */

const localStorageKey = 'todos-vdux'

/**
 * Action creators
 */

function initializeApp () {
  return [
    hydrateTodos(),
    initializeRouter()
  ]
}

function urlDidUpdate (url) {
  return {
    type: URL_DID_UPDATE,
    payload: {
      url
    }
  }
}

function initializeRouter () {
  return bindUrl(urlDidUpdate)
}

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

function setTodoText (idx, text) {
  return {
    type: TODO_SET_TEXT,
    payload: {
      idx,
      text
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

function setAllCompleted (completed) {
  return {
    type: SET_ALL_COMPLETED,
    payload: {
      completed
    }
  }
}

function clearCompleted () {
  return {
    type: CLEAR_COMPLETED
  }
}

function persistTodos (todos) {
  return setItem(localStorageKey, JSON.stringify(todos))
}

function hydrateTodos () {
  return bind(getItem(localStorageKey), todosStr => todosStr && hydrateState({todos: JSON.parse(todosStr)}))
}

function hydrateState (state) {
  return {
    type: HYDRATE_STATE,
    payload: state
  }
}


/**
 * Exports
 */

export {
  // Action creators
  addTodo,
  removeTodo,
  setTodoText,
  setImportant,
  setCompleted,
  setAllCompleted,
  clearCompleted,
  persistTodos,
  initializeApp,

  // Action types
  TODO_ADD,
  TODO_REMOVE,
  TODO_SET_TEXT,
  TODO_SET_IMPORTANT,
  TODO_SET_COMPLETED,
  SET_ALL_COMPLETED,
  CLEAR_COMPLETED,
  URL_DID_UPDATE,
  HYDRATE_STATE
}
