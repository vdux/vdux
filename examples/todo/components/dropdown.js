/**
 * Imports
 */

import {handleOnce, unhandle} from 'redux-effects-events'
import {localAction} from 'virtex-local'
import {bind} from 'redux-effects'
import element from 'virtex-element'

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
    return bindCloseHandler(next.actions)
  } else if(prev.state.open && !next.state.open) {
    return unbindCloseHandler(next.actions, next.state.handlerId)
  }
}

function bindCloseHandler ({close, setHandlerId}) {
  return bind(
    handleOnce('click', close),
    setHandlerId
  )
}

function unbindCloseHandler ({setHandlerId}, id) {
  return [
    unhandle('click', id),
    setHandlerId(null)
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
    case SET_HANDLER_ID:
      return {
        ...state,
        handlerId: action.payload
      }
  }

  return state
}

/**
 * Exports
 */

export default {
  initialState,
  beforeUpdate,
  render,
  reducer,
  actions: {
    toggle: localAction(TOGGLE),
    close: localAction(CLOSE),
    setHandlerId: localAction(SET_HANDLER_ID)
  }
}
