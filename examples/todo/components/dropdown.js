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
  if (!prev.props.open && next.props.open) {
    return bindCloseHandler(next.props.close, next.local)
  } else if(prev.props.open && !next.props.open) {
    return unbindCloseHandler(next.local, next.state.handlerId)
  }
}

function bindCloseHandler (close, local) {
  return bind(
    handleOnce('click', close),
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

function render ({children, props}) {
  const {open} = props

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

function setHandlerId (id) {
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
  toggle,
  close,
  TOGGLE,
  CLOSE
}
