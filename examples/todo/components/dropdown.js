/**
 * Imports
 */

import {handleOnce, unhandle} from 'redux-effects-events'
import element from 'virtex-element'
import {bind} from 'redux-effects'

/**
 * Actions
 */

const TOGGLE = 'TOGGLE_DROPDOWN'
const CLOSE = 'CLOSE_DROPDOWN'
const SET_HANDLER_ID = 'SET_HANDLER_ID'

/**
 * initialState
 */

function initialState () {
  return {
    open: false
  }
}

/**
 * beforeUpdate
 */

function beforeUpdate (prev, next) {
  if (!prev.state.open && next.state.open) {
    return bindCloseHandler(next.local)
  } else if(prev.state.open && !next.state.open) {
    return unbindCloseHandler(next.local, next.state.handlerId)
  }
}

function bindCloseHandler (local) {
  return bind(
    handleOnce('click', local(close)),
    local(setHandlerId)
  )
}

function unbindCloseHandler (local, id) {
  return [
    unhandle('click', id),
    local(setHandlerId)(null)
  ]
}

/**
 * Render
 */

function render ({children, state}) {
  const {open} = state

  return (
    <ul class='dropdown' style={{display: open ? 'block' : 'none'}}>
      {children.map(item => <li>{item}</li>)}
    </ul>
  )
}

/**
 * Reducer
 */

function reducer (state, action) {
  switch (action.type) {
    case SET_HANDLER_ID:
      return {
        ...state,
        handlerId: action.payload
      }
    case TOGGLE:
      return {
        ...state,
        open: !state.open
      }
    case CLOSE:
      return {
        ...state,
        open: false
      }
  }

  return state
}

/**
 * Local actions
 */

function toggle () {
  return {
    type: TOGGLE
  }
}

function close () {
  return {
    type: CLOSE
  }
}

function setHandlerId (model, id) {
  return {
    type: SET_HANDLER_ID,
    payload: id
  }
}

/**
 * Exports
 */

export default {
  initialState,
  beforeUpdate,
  render,
  reducer,
  toggle
}
