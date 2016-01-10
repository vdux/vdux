/**
 * Imports
 */

import h from '../../element'

/**
 * App
 */

function app (state) {
  return h('div', {onClick: increment}, ['Counter: ' + state.counter])
}

function increment () {
  return {
    type: 'INCREMENT'
  }
}

/**
 * Exports
 */

export default app
