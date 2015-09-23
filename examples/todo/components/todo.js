/**
 * Imports
 */

import localize from 'vdux-local'
import element from 'vdom-element'
import Dropdown from './dropdown'
import {removeTodo, setImportant, setCompleted} from '../actions'

/**
 * Render
 */

function render (props) {
  const {idx, key, text, dropdown, important, completed} = props
  const dropdownKey = props.key + '.dropdown'

  return (
    <li class={{completed, important}}>
      <div class='view'>
        <input class='toggle' type='checkbox' ev-click={() => setCompleted(idx, !completed)} />
        <label style={{color: important ? 'red' : 'black'}}>
          {text}
          <img class='options' src='css/options.png' ev-click={() => Dropdown.toggle(dropdownKey)} />
          <Dropdown {...dropdown} key={dropdownKey}>
            <div ev-click={() => setImportant(idx, !important)}>Important</div>
            <div ev-click={() => removeTodo(idx)}>Remove</div>
          </Dropdown>
        </label>
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
