/**
 * Imports
 */

import localstorage, {getItem, setItem} from 'redux-effects-localstorage'
import location, {bindUrl} from 'redux-effects-location'
import Footer from './components/footer'
import {component, element} from '../..'
import Todo from './components/todo'
import logger from 'redux-logger'

/**
 * Constants
 */

const localStorageKey = 'todos-vdux'

/**
 * <App/>
 */

export default component({
  initialState: {
    url: '',
    todos: [],
    text: '',
    test: 'eeeeee'
  },

  onCreate ({actions}) {
    return actions.initializeApp
  },

  render ({state, actions}) {
    const {url, todos, text} = state
    const {setAllCompleted, addTodo, clearText, setText, clearCompleted} = actions
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
            onInput={setText}
            onKeyDown={{enter: text && [addTodo({text, completed: false, important: false}), clearText]}}
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
                  ? <Todo idx={i} {...todo} todoApi={actions} />
                  : null)
            }
          </ul>
        </section>
        {
          todos.length
            ? <Footer itemsLeft={itemsLeft} completed={numCompleted} active={activeFilter} clearCompleted={clearCompleted} />
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
  },

  onUpdate (prev, next) {
    if (prev.state.todos !== next.state.todos) {
      return next.actions.persistTodos(next.state.todos)
    }
  },

  middleware: [
    localstorage(window.localStorage),
    location(),
    logger()
  ],

  controller: {
    * initializeApp ({hydrateTodos, updateUrl, thisIsAtest}) {
      const todos = yield getItem(localStorageKey)

      try {
        yield hydrateTodos(JSON.parse(todos))
      } catch (e) {

      }

      yield bindUrl(url => updateUrl(url))
    },

    * persistTodos (actions, todos) {
      yield setItem(localStorageKey, JSON.stringify(todos))
    }
  },

  reducer: {
    updateUrl: (state, url) => ({url}),
    hydrateTodos: (state, todos) => ({todos}),
    setText: (state, e) => ({text: e.target.value.trim()}),
    clearText: state => ({text: ''}),
    setTodoText: updateSpecificTodo((todo, text) => ({...todo, text})),
    setImportant: updateSpecificTodo((todo, important) => ({...todo, important})),
    setCompleted: updateSpecificTodo((todo, completed) => ({...todo, completed})),
    addTodo: (state, todo) => ({
      todos: state.todos.concat(todo)
    }),
    removeTodo: (state, idx) => ({
      todos: state.todos.filter((todo, i) => i !== idx)
    }),
    setAllCompleted: (state, completed) => ({
      todos: state.todos.map(todo => ({...todo, completed}))
    }),
    clearCompleted: state => ({
      todos: state.todos.filter(todo => !todo.completed)
    })
  }
})

/**
 * Utilities
 */

function updateSpecificTodo (fn) {
  return ({todos}, idx, ...rest) => {
    return {
      todos: todos.map((todo, i) => i === idx ? fn(todo, ...rest) : todo)
    }
  }
}
