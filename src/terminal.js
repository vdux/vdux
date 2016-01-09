/**
 * Terminal middleware
 */

function terminal () {
  return next => action => {
    throw new Error(`Action ${action.type} not processed by vdux middleware`)
  }
}

/**
 * Exports
 */

export default terminal
