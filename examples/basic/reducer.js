/**
 * Reducer
 */

function reducer (state, action) {
  if (action.type === 'INCREMENT') {
    return {
      ...state,
      counter: state.counter + 1
    }
  }

  return state
}

/**
 * Exports
 */

export default reducer
