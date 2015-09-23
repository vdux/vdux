/**
 * Imports
 */

import localize, {localAction} from 'vdux-local'
import {handleOnce, unhandle} from 'declarative-events'
import bind from 'bind-effect'
import element from 'vdom-element'

/**
 * Action types
 */

const TOGGLE = 'TOGGLE_DROPDOWN'

/**
 * beforeUpdate
 */

function beforeUpdate (prevProps, nextProps, setState) {
  if (!prevProps.open && nextProps.open) {
    return bindCloseHandler(setState)
  } else if(prevProps.open && !nextProps.open) {
    return unbindCloseHandler(setState, nextProps.handlerId)
  }
}

function bindCloseHandler (setState) {
  return bind(
    handleOnce('click', () => setState({open: false})),
    id => setState({handlerId: id})
  )
}

function unbindCloseHandler (setState, id) {
  return [
    unhandle('click', id),
    setState({handlerId: null})
  ]
}

/**
 * Render
 */

function render (props) {
  const {open, children} = props

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
  }

  return state
}

/**
 * Actions
 */

const toggle = localAction(TOGGLE)

/**
 * Exports
 */

export default localize({
  beforeUpdate,
  render,
  reducer,
  toggle
})
