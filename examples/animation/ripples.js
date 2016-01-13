/**
 * Imports
 */

import createAction from '@f/create-action'
import element from '../../element'
import Ripple from './ripple'
import uid from 'get-uid'

/**
 * Constants
 */

const defaultStyle = {
  height: '100%',
  width: '100%',
  top: 0,
  left: 0,
  overflow: 'hidden',
  position: 'absolute'
}

/**
 * Ripple
 */

function initialState () {
  return {
    ripples: []
  }
}

function render ({props, state, local}) {
  const {x, y} = props

  return (
    <div style={defaultStyle}>
      {state.ripples.map(ripple => <Ripple key={ripple.id} {...ripple} onEnd={local(removeRipple, ripple)} />)}
    </div>
  )
}

/**
 * Reducer
 */

function reducer (state, action) {
  switch (action.type) {
    case 'add ripple':
      return {
        ...state,
        ripples: [...state.ripples, action.payload]
      }
    case 'remove ripple':
      return {
        ...state,
        ripples: state.ripples.filter(r => r !== action.payload)
      }
  }

  return state
}

/**
 * Action creators
 */

const addRipple = createAction('add ripple', e => ({x: e.offsetX, y: e.offsetY, id: uid()}))
const removeRipple = createAction('remove ripple')

/**
 * Exports
 */

export default {
  initialState,
  render,
  reducer,
  addRipple
}
