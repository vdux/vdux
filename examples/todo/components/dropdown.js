/**
 * Imports
 */

import localize, {localAction} from 'vdux-local'
import {handleOnce, unhandle} from 'redux-effects-events'
import {bind} from 'redux-effects'
import element from 'vdom-element'

/**
 * Actions
 */

const TOGGLE = 'TOGGLE_DROPDOWN'
const CLOSE = 'CLOSE_DROPDOWN'
const SET_HANDLER_ID = 'SET_HANDLER_ID'

const toggle = localAction(TOGGLE)
const close = localAction(CLOSE)
const setHandlerId = localAction(SET_HANDLER_ID)

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

function beforeUpdate (prevProps, nextProps) {
  const prevState = prevProps.state
  const nextState = nextProps.state

  if (!prevState.open && nextState.open) {
    return bindCloseHandler(nextProps.key)
  } else if(prevState.open && !nextState.open) {
    return unbindCloseHandler(nextProps.key, nextState.handlerId)
  }
}

function bindCloseHandler (key) {
  return bind(
    handleOnce('click', () => close(key)),
    id => setHandlerId(key, id)
  )
}

function unbindCloseHandler (key, id) {
  return [
    unhandle('click', id),
    setHandlerId(key, null)
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

export default localize({
  initialState,
  beforeUpdate,
  render,
  reducer,
  toggle
})
