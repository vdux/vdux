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
 * Local actions
 */

const BEGIN_EDIT = 'BEGIN_EDIT'
const CANCEL_EDIT = 'CANCEL_EDIT'

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
  const {text, important, completed} = props
  const {beginEdit, toggleDropdown, submitEdit, handleKeydown, toggleCompleted, toggleImportant, remove} = actions
  const {editing} = state

  return (
    <li class={{completed, important, editing}}>
      <div class='view' onDblClick={beginEdit}>
        <input class='toggle' type='checkbox' onChange={toggleCompleted} checked={completed} />
        <label style={{color: important ? 'red' : 'black'}}>
          {text}
          <img class='options' src='css/options.png' onClick={toggleDropdown} />
          <Dropdown ref={ref('dropdown')}>
            <div onClick={toggleImportant}>Important</div>
            <div onClick={remove}>Remove</div>
          </Dropdown>
        </label>
      </div>
      <input class='edit'
        focused={editing}
        value={text}
        onBlur={submitEdit}
        onKeyDown={handleKeydown} />
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
 * Exports
 */

export default {
  initialState,
  render,
  reducer,
  actions: {
    beginEdit: localAction(BEGIN_EDIT),
    cancelEdit: localAction(CANCEL_EDIT),
    remove: ({props}) => removeTodo(props.idx),
    toggleCompleted: ({props}) => setCompleted(props.idx, !props.completed),
    toggleImportant: ({props}) => setImportant(props.idx, !props.important),
    handleKeydown: ({actions}, e) => {
      const {submitEdit, cancelEdit} = actions

      switch (e.which) {
        case ENTER_KEY:
          return submitEdit(e.currentTarget.value)
        case ESCAPE_KEY:
          return cancelEdit()
      }
    },
    submitEdit: ({actions, props}, e) => {
      const str = e.currentTarget.value.trim()
      const {cancelEdit} = actions
      const {idx} = props

      return str
        ? [setTodoText(idx, str), cancelEdit()]
        : cancelEdit()
    },
    toggleDropdown ({refs}) {
      return refs.dropdown.toggle()
    }
  }
}
