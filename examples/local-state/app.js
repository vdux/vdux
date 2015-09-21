/**
 * Imports
 */

import element from 'vdom-element'
import {addTodo, removeTodo, markTodoImportant} from './actions'
import localize from 'vdux-local'

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
  const {app = {}, todos} = props

  return (
    <div>
      <input type='text' ev-keyup={e => handleKeyup(setState, e)} value={app.text} />
      <ul>
        {
          todos.map(todo => <li>{todo.text}</li>)
        }
      </ul>
    </div>
  )
}

/**
 * Exports
 */

export default localize({
  render
})
