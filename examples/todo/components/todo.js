/**
 * Imports
 */

import element from 'virtex-element'
import {localAction} from 'virtex-local'
import Dropdown from './dropdown'
import {removeTodo, setImportant, setCompleted, setTodoText} from '../actions'

/**
 * Key constants
 */

const ENTER_KEY = 13
const ESCAPE_KEY = 27

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

function render ({state, props, local}) {
  const {text, important, completed, idx} = props
  const {editing, dropdownOpen} = state

  return (
    <li class={{completed, important, editing}}>
      <div class='view' onDblClick={local(beginEdit)}>
        <input class='toggle' type='checkbox' onChange={e => setCompleted(idx, !completed)} checked={completed} />
        <label style={{color: important ? 'red' : 'black'}}>
          {text}
          <img class='options' src='css/options.png' onClick={local(Dropdown.toggle)} />
          <Dropdown open={dropdownOpen} close={local(Dropdown.close)}>
            <div onClick={e => toggleImportant(idx, !important)}>Important</div>
            <div onClick={local(remove)}>Remove</div>
          </Dropdown>
        </label>
      </div>
      <input class='edit'
        focused={editing}
        value={text}
        onBlur={submitEdit(local(cancelEdit), idx)}
        onKeyDown={handleKeydown(local(cancelEdit), idx)} />
    </li>
  )
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
    case Dropdown.TOGGLE:
      return {
        ...state,
        dropdownOpen: !state.dropdownOpen
      }
    case Dropdown.CLOSE:
      return {
        ...state,
        dropdownOpen: false
      }
  }
}

/**
 * Local actions
 */

const BEGIN_EDIT = 'BEGIN_EDIT'
const CANCEL_EDIT = 'CANCEL_EDIT'

function beginEdit () {
  return {
    type: 'BEGIN_EDIT'
  }
}

function cancelEdit () {
  return {
    type: 'CANCEL_EDIT'
  }
}

function remove ({props}) {
  return removeTodo(props.idx)
}

function handleKeydown (cancelEdit, idx) {
  const submit = submitEdit(cancelEdit, idx)

  return e => {
    switch (e.which) {
      case ENTER_KEY:
        return submit(e)
      case ESCAPE_KEY:
        return cancelEdit()
    }
  }
}

function submitEdit (cancelEdit, idx) {
  return e => {
    const text = e.currentTarget.value.trim()
    return text
      ? [setTodoText(idx, text), cancelEdit()]
      : cancelEdit()
  }
}

/**
 * Exports
 */

export default {
  initialState,
  render,
  reducer
}
