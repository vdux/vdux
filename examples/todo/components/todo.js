/**
 * Imports
 */

import {component, element} from '../../..'
import Dropdown from './dropdown'

/**
 * <Todo/>
 */

export default component({
  initialState: {
    editing: false
  },

  reducer: {
    beginEdit: (state, editText) => ({editing: true, editText}),
    cancelEdit: () => ({editing: false}),
    setEditText: (state, e) => ({editText: e.target.value})
  },

  render ({state, props, actions}) {
    const {text, important, completed, idx, todoApi} = props
    const {beginEdit, cancelEdit, setEditText, handleKeydown} = actions
    const {setTodoText, removeTodo, setImportant, setCompleted} = todoApi
    const {editing, editText} = state

    const submit = editText
      ? [setTodoText(idx, editText), cancelEdit]
      : removeTodo(idx)

    return (
      <li class={{completed, important, editing}}>
        <div class='view' onDblclick={beginEdit(text)}>
          <input class='toggle' type='checkbox' onChange={setCompleted(idx, !completed)} checked={completed} />
          <label style={{color: important ? 'red' : 'black'}}>
            {text}
            <Dropdown btn={<img class='options' src='css/options.png' />}>
              <div onClick={setImportant(idx, !important)}>Important</div>
              <div onClick={removeTodo(idx)}>Remove</div>
            </Dropdown>
          </label>
        </div>
        <input class='edit'
          focused={editing}
          value={editText}
          onBlur={editing && submit}
          onInput={setEditText}
          onKeyDown={{enter: submit, esc: cancelEdit}} />
      </li>
    )
  }
})
