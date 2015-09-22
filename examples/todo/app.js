/**
 * Imports
 */

import element from 'vdom-element'
import {addTodo, removeTodo, markTodoImportant} from './actions'
import localize from 'vdux-local'
import Todo from './components/todo'
import Footer from './components/footer'

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
 * handleKeyup
 */

function handleKeyup (setState, e) {
  const text = e.target.value

  return e.which === 13
    ? [setState({text: ''}), addTodo(text)]
    : setState({text})
}

/**
 * Render
 */

function render (props, setState) {
  const {app = {}, todos, key} = props
  const todoKey = idx => key + '.todos.' + idx

  return (
    <section class='todoapp'>
      <header class='header'>
        <h1>todos</h1>
        <input
          class='new-todo'
          autofocus
          type='text'
          ev-keyup={e => handleKeyup(setState, e)}
          value={app.text}
          placeholder='What needs to be done?' />
      </header>
      <section class='main' style={{display: todos.length ? 'block' : 'none'}}>
        <input class='toggle-all' type='checkbox' />
        <label for='toggle-all'>
          Mark all as complete
        </label>
        <ul class='todo-list'>
          {
            todos.map((todo, i) =>
              <Todo key={todoKey(i)} idx={i} {...todo} {...app.todos[i]} />)
          }
        </ul>
      </section>
      <Footer count={todos.length} />
    </section>
  )
}

/**
 * Exports
 */

export default localize({
  initialState,
  render
})
