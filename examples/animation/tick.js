/**
 * Imports
 */

import {raf, cancelAnimationFrame} from 'redux-effects-timeout'
import createAction from '@f/create-action'
import {bind} from 'redux-effects'

/**
 * Tick
 */

function initialState () {
  return {
    tick: 0
  }
}

function onCreate ({local}) {
  return bind(raf(local(tick)), local(setRafId))
}

function render ({state, children}) {
  return children[0](state.tick)
}

function onUpdate (prev, next) {
  if (next.props.done(next.state.tick)) {
    return [
      cancelAnimationFrame(next.state.rafId),
      next.props.onEnd && next.props.onEnd()
    ]
  } else {
    return bind(raf(next.local(tick)), next.local(setRafId))
  }
}

function onRemove ({state}) {
  return cancelAnimationFrame(state.rafId)
}

const setRafId = createAction('set raf id', a => a, () => ({nolog: true}))
const tick = createAction('tick', a => a, () => ({nolog: true}))

function reducer (state, action) {
  switch (action.type) {
    case 'set raf id':
      return {
        ...state,
        rafId: action.payload
      }
    case 'tick': {
      return {
        ...state,
        tick: state.tick + 1
      }
    }
  }
}

/**
 * Exports
 */

export default {
  render,
  onUpdate,
  onRemove,
  reducer,
  initialState
}
