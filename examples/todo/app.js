/**
 * Imports
 */

import element from 'vdom-element'
import {addTodo, removeTodo, markTodoImportant} from './actions'
import localize from 'vdux-local'
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
    <div>
      <input type='text' ev-keyup={e => handleKeyup(setState, e)} value={app.text} />
      <ul>
        {
          todos.map((todo, i) =>
            <Todo key={todoKey(i)} text={todo.text} {...app.todos[i]} />
          )
        }
      </ul>
    </div>
  )
}

/**
 * Exports
 */

export default localize({
  initialState,
  render
})
