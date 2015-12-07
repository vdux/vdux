/**
 * Imports
 */

import {removeTodo, setImportant, setCompleted, setTodoText} from '../actions'
import combineReducers from '@micro-js/combine-reducers'
import handleActions from '@micro-js/handle-actions'
import createAction from '@micro-js/create-action'
import element from 'virtex-element'
import Dropdown from './dropdown'

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

function render ({state, props, local, ref}) {
  const {text, important, completed, idx} = props
  const {editing} = state

  return (
    <li class={{completed, important, editing}}>
      <div class='view' onDblClick={local(beginEdit)}>
        <input class='toggle' type='checkbox' onChange={e => setCompleted(idx, !completed)} checked={completed} />
        <label style={{color: important ? 'red' : 'black'}}>
          {text}
          <img class='options' src='css/options.png' onClick={ref.to('dropdown', Dropdown.toggle)} />
          <Dropdown ref={ref.as('dropdown')}>
            <div onClick={e => setImportant(idx, !important)}>Important</div>
            <div onClick={e => removeTodo(idx)}>Remove</div>
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
 * Local actions
 */

const BEGIN_EDIT = 'BEGIN_EDIT'
const CANCEL_EDIT = 'CANCEL_EDIT'

const beginEdit = createAction(BEGIN_EDIT)
const cancelEdit = createAction(CANCEL_EDIT)

/**
 * Local reducer
 */

const reducer = combineReducers({
  editing: handleActions({
    [BEGIN_EDIT]: () => true,
    [CANCEL_EDIT]: () => false
  })
})

/**
 * Action helpers
 */

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
