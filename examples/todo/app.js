/**
 * Imports
 */

import element from 'virtex-element'
import Todo from './components/todo'
import Footer from './components/footer'
import {addTodo, removeTodo, markTodoImportant, setAllCompleted} from './actions'

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

function render ({props, state, local}) {
  const {url, todos} = props
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
          onKeyUp={handleKeyup(local(setText))}
          onKeyDown={maybeSubmit(local(setText))}
          value={state.text}
          placeholder='What needs to be done?' />
      </header>
      <section id='main' class='main' style={{display: todos.length ? 'block' : 'none'}}>
        <input class='toggle-all' type='checkbox' onChange={toggleAll} checked={allDone} />
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
 * Reducer
 */

function reducer (state, action) {
  switch (action.type) {
    case SET_TEXT:
    console.log('here', action)
      return {
        ...state,
        text: action.payload
      }
  }

  return state
}

/**
 * Local actions
 */

const SET_TEXT = 'SET_TEXT'

function setText (model, text) {
  return {
    type: SET_TEXT,
    payload: text
  }
}

function handleKeyup (setText) {
  return e => setText(e.target.value.trim())
}

function maybeSubmit (setText) {
  return e => {
    const text = e.target.value.trim()
    if (text && e.which === ENTER_KEY) {
      return [
        setText(''),
        addTodo(text)
      ]
    }
  }
}

function toggleAll (e) {
  return setAllCompleted(e.target.checked)
}

/**
 * Exports
 */

export default {
  initialState,
  render,
  reducer
}
