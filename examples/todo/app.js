/**
 * Imports
 */

import combineReducers from '@micro-js/combine-reducers'
import handleActions from '@micro-js/handle-actions'
import createAction from '@micro-js/create-action'
import curryOnce from '@micro-js/curry-once'
import Footer from './components/footer'
import * as actions from './actions'
import element from 'virtex-element'
import Todo from './components/todo'

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
  const {text} = state
  const numCompleted = todos.reduce((acc, todo) => acc + (todo.completed ? 1 : 0), 0)
  const allDone = numCompleted === todos.length
  const itemsLeft = todos.length - numCompleted
  const activeFilter = url.slice(1).toLowerCase() || 'all'
  const submit = [addTodo(text), local(clearText)]

  return (
    <section class='todoapp'>
      <header class='header'>
        <h1>todos</h1>
        <input
          class='new-todo'
          autofocus
          type='text'
          onInput={local(setText)}
          onKeyDown={{enter: text && submit}}
          value={state.text}
          placeholder='What needs to be done?' />
      </header>
      <section id='main' class='main' style={{display: todos.length ? 'block' : 'none'}}>
        <input class='toggle-all' type='checkbox' onChange={setAllCompleted(!allDone)} checked={allDone} />
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
 * Local actions
 */

const SET_TEXT = 'SET_TEXT'
const CLEAR_TEXT = 'CLEAR_TEXT'
const setText = createAction(SET_TEXT, e => e.target.value.trim())
const clearText = createAction(CLEAR_TEXT)

/**
 * Reducer
 */

const reducer = combineReducers({
  text: handleActions({
    [CLEAR_TEXT]: () => '',
    [SET_TEXT]: (state, text) => text
  })
})

/**
 * Curried global actions
 */

const addTodo = curryOnce(actions.addTodo)
const setAllCompleted = curryOnce(actions.setAllCompleted)

/**
 * Exports
 */

export default {
  initialState,
  render,
  reducer
}
