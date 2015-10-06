/**
 * Imports
 */

import localize, {localAction} from 'vdux-local'
import element from 'vdom-element'
import Dropdown from './dropdown'
import {removeTodo, setImportant, setCompleted, setTodoText} from '../actions'

/**
 * Key constants
 */

const ENTER_KEY = 13
const ESCAPE_KEY = 27

/**
 * Local actions
 */

const BEGIN_EDIT = 'BEGIN_EDIT'
const CANCEL_EDIT = 'CANCEL_EDIT'

const beginEdit = localAction(BEGIN_EDIT)
const cancelEdit = localAction(CANCEL_EDIT)

/**
 * Initial state
 */

function initialState () {
  return {
    editing: false
  }
}

/**
 * Render
 */

function render ({idx, key, text, important, completed, state}, childState) {
  const {editing} = state

  return (
    <li class={{completed, important, editing}}>
      <div class='view' ev-dblclick={() => beginEdit(key)}>
        <input class='toggle' type='checkbox' ev-change={() => setCompleted(idx, !completed)} checked={completed} />
        <label style={{color: important ? 'red' : 'black'}}>
          {text}
          <img class='options' src='css/options.png' ev-click={() => Dropdown.toggle(`${key}.dropdown`)} />
          <Dropdown {...childState('dropdown')}>
            <div ev-click={() => setImportant(idx, !important)}>Important</div>
            <div ev-click={() => removeTodo(idx)}>Remove</div>
          </Dropdown>
        </label>
      </div>
      <input class='edit'
        focused={editing}
        value={text}
        ev-blur={e => submitEdit(e.currentTarget.value)}
        ev-keydown={handleKeydown} />
    </li>
  )

  function handleKeydown (e) {
    switch (e.which) {
      case ENTER_KEY:
        return submitEdit(e.currentTarget.value)
      case ESCAPE_KEY:
        return cancelEdit(key)
    }
  }

  function submitEdit (str) {
    str = str.trim()
    return str
      ? [setTodoText(idx, str), cancelEdit(key)]
      : cancelEdit(key)
  }
}

/**
 * Local reducer
 */

function reducer (state, action) {
  switch (action.type) {
    case BEGIN_EDIT:
      return {
        ...state,
        editing: true
      }
    case CANCEL_EDIT:
      return {
        ...state,
        editing: false
      }
  }
}

/**
 * Exports
 */

export default localize({
  initialState,
  render,
  reducer
})
