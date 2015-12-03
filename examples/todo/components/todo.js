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

function render ({state, props, actions, ref}) {
  const {text, important, completed, idx} = props
  const {editing} = state

  return (
    <li class={{completed, important, editing}}>
      <div class='view' onDblClick={actions.beginEdit}>
        <input class='toggle' type='checkbox' onChange={actions.toggleCompleted} checked={completed} />
        <label style={{color: important ? 'red' : 'black'}}>
          {text}
          <img class='options' src='css/options.png' onClick={actions.toggleDropdown} />
          <Dropdown ref={ref('dropdown')}>
            <div onClick={actions.toggleImportant}>Important</div>
            <div onClick={actions.remove}>Remove</div>
          </Dropdown>
        </label>
      </div>
      <input class='edit'
        focused={editing}
        value={text}
        onBlur={actions.submitEdit}
        onKeyDown={actions.handleKeydown} />
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
  }
}

/**
 * Local actions
 */

const BEGIN_EDIT = 'BEGIN_EDIT'
const CANCEL_EDIT = 'CANCEL_EDIT'

const beginEdit = localAction(BEGIN_EDIT)
const cancelEdit = localAction(CANCEL_EDIT)

function toggleCompleted ({props}) {
  return setCompleted(props.idx, !props.completed)
}

function toggleImportant ({props}) {
  return setImportant(props.idx, !props.important)
}

function remove ({props}) {
  return removeTodo(props.idx)
}

function handleKeydown ({actions}, e) {
  switch (e.which) {
    case ENTER_KEY:
      return actions.submitEdit(e.currentTarget.value)
    case ESCAPE_KEY:
      return actions.cancelEdit()
  }
}

function submitEdit ({props, actions}, e) {
  const {idx} = props
  const text = e.currentTarget.value.trim()
  return text
    ? [setTodoText(idx, text), actions.cancelEdit()]
    : actions.cancelEdit()
}

function toggleDropdown ({refs}) {
  return refs.dropdown.toggle()
}


/**
 * Exports
 */

export default {
  initialState,
  render,
  reducer,
  actions: {
    beginEdit,
    cancelEdit,
    remove,
    toggleCompleted,
    toggleImportant,
    handleKeydown,
    submitEdit,
    toggleDropdown
  }
}
