/**
 * Imports
 */

import h from '../../element'

/**
 * App
 */

function app (state) {
  return h('div', {onClick: 'INCREMENT'}, ['Counter: ' + state.counter])
}

/**
 * Exports
 */

export default app
