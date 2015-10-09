/**
 * Imports
 */

import {setItem} from 'redux-effects-localstorage'

/**
 * Todo persistence middleware
 */

function persist({dispatch, getState}) {
  return next => action => {
    const prevState = getState()
    const result = next(action)
    const nextState = getState()

    if (prevState.todos !== nextState.todos) {
      dispatch(setItem('todos-vdux', JSON.stringify(nextState.todos)))
    }

    return result
  }
}

/**
 * Exports
 */

export default persist
