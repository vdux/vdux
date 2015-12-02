/**
 * Imports
 */

import element from 'virtex-element'
import {addTodo, removeTodo, markTodoImportant, setAllCompleted} from './actions'
import {localAction} from 'virtex-local'
import Todo from './components/todo'
import Footer from './components/footer'

/**
 * Constants
 */

const ENTER_KEY = 13

/**
 * initialState
 */

function initialState () {
  return {
    todos: [],
    text: ''
  }
}

/**
 * Render
 */

function render ({props, state, actions}) {
  const {url, todos} = props
  const {setText} = actions
  const numCompleted = todos.reduce((acc, todo) => acc + (todo.completed ? 1 : 0), 0)
  const allDone = numCompleted === todos.length
  const itemsLeft = todos.length - numCompleted
  const activeFilter = url.slice(1).toLowerCase() || 'all'

  return (
    <section class='todoapp'>
      <header class='header'>
        <h1>todos</h1>
        <input
          class='new-todo'
          autofocus
          type='text'
          onKeyUp={handleKeyup}
          value={state.text}
          placeholder='What needs to be done?' />
      </header>
      <section id='main' class='main' style={{display: todos.length ? 'block' : 'none'}}>
        <input class='toggle-all' type='checkbox' onChange={e => setAllCompleted(e.target.checked)} checked={allDone} />
        <label for='toggle-all'>
          Mark all as complete
        </label>
        <ul class='todo-list'>
          {
            todos.map((todo, i) => isShown(todo)
                ? <Todo idx={i} {...todo} />
                : null)
          }
        </ul>
      </section>
      {
        todos.length
          ? <Footer itemsLeft={itemsLeft} completed={numCompleted} active={activeFilter} />
          : null
      }
    </section>
  )

  function handleKeyup (e) {
    const text = e.target.value.trim()
    return text && e.which === ENTER_KEY
      ? [setText(''), addTodo(text)]
      : setText(text)
  }

  function isShown (todo) {
    switch (activeFilter) {
      case 'completed':
        return todo.completed
      case 'active':
        return !todo.completed
      default:
        return true
    }
  }
}

/**
 * Actions
 */

const SET_TEXT = 'SET_TEXT'

/**
 * Reducer
 */

function reducer (state, action) {
  switch (action.type) {
    case SET_TEXT:
      return {
        ...state,
        text: action.payload
      }
  }

  return state
}

/**
 * Exports
 */

export default {
  initialState,
  render,
  reducer,
  actions: {
    setText: localAction(SET_TEXT)
  }
}
