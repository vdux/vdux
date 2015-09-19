/**
 * Imports
 */

import element from 'vdom-element'
import {addTodo, removeTodo, markTodoImportant} from './actions'

/**
 * handleKeypress
 */

function handleSubmit (e) {
  e.preventDefault()
  console.log('test', e.target)
}


/**
 * Render
 */

function render (props) {
  return (
    <div>
      <form ev-submit={handleSubmit}>
        <input type='text' />
      </form>
      <ul>
        {
          props.todos.map(todo => <li>{todo.text}</li>)
        }
      </ul>
    </div>
  )
}

/**
 * Exports
 */

export default {
  render
}
