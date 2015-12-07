/**
 * Imports
 */

import {handleOnce, unhandle} from 'redux-effects-events'
import combineReducers from '@micro-js/combine-reducers'
import handleActions from '@micro-js/handle-actions'
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

const reducer = combineReducers({
  handlerId: handleActions({
    [SET_HANDLER_ID]: (state, id) => id
  }),
  open: handleActions({
    [TOGGLE]: (state) => !state,
    [CLOSE]: () => false
  })
})

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
 * Exports
 */

export default {
  initialState,
  beforeUpdate,
  render,
  reducer,
  toggle
}
