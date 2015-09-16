/**
 * Imports
 */

import h from 'virtual-dom/h'

/**
 * App
 */

function app (state) {
  return h('div', {'ev-click': increment}, ['Counter: ' + state.counter])
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
