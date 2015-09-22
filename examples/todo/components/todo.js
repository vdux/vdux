/**
 * Imports
 */

import localize from 'vdux-local'
import element from 'vdom-element'
import Dropdown from './dropdown'
import {removeTodo, toggleTodoImportant} from '../actions'

/**
 * Render
 */

function render (props) {
  const {idx, key, text, dropdown, important, completed} = props
  const dropdownKey = props.key + '.dropdown'

  return (
    <li class={completed ? 'completed' : ''}>
      <div class='view'>
        <input class='toggle' type='checkbox' />
        <label style={{color: important ? 'red' : 'black'}}>
          {text}
        </label>
        <span ev-click={e => Dropdown.toggle(dropdownKey)} style={{marginLeft: '12px', color: 'blue'}} >
          options
        </span>
        <Dropdown {...dropdown} key={dropdownKey}>
          <div ev-click={() => toggleTodoImportant(idx)}>Mark important</div>
          <div ev-click={() => removeTodo(idx)}>Remove</div>
        </Dropdown>
      </div>
    </li>
  )
}

/**
 * Exports
 */

export default localize({
  render
})
