/**
 * Imports
 */

import {bind} from 'redux-effects'
import {bindUrl} from 'redux-effects-location'
import createAction from '@micro-js/create-action'
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
 * Constants
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

function initializeRouter () {
  return bindUrl(urlDidUpdate)
}

const urlDidUpdate = createAction(URL_DID_UPDATE, url => ({url}))
const addTodo = createAction(TODO_ADD, text => ({text}))
const removeTodo = createAction(TODO_REMOVE, idx => ({idx}))
const setTodoText = createAction(TODO_SET_TEXT, (idx, text) => ({idx, text}))
const setImportant = createAction(TODO_SET_IMPORTANT, (idx, important) => ({idx, important}))
const setCompleted = createAction(TODO_SET_COMPLETED, (idx, completed) => ({idx, completed}))
const setAllCompleted = createAction(SET_ALL_COMPLETED, completed => ({completed}))
const clearCompleted = createAction(CLEAR_COMPLETED)

function persistTodos (todos) {
  return setItem(localStorageKey, JSON.stringify(todos))
}

function hydrateTodos () {
  return bind(getItem(localStorageKey), todosStr => todosStr && hydrateState({todos: JSON.parse(todosStr)}))
}

const hydrateState = createAction(HYDRATE_STATE)

/**
 * Exports
 */

export {
  addTodo,
  removeTodo,
  setTodoText,
  setImportant,
  setCompleted,
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
