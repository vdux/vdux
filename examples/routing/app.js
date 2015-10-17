/**
 * Imports
 */

import element from 'vdom-element'
import {initializeApp} from './actions'
import router from './router'

/**
 * Before mount
 */

function beforeMount () {
  return initializeApp()
}

/**
 * Render
 */

function render (props) {
  return router(props.url || '/', props)
}

/**
 * Exports
 */

export default {
  beforeMount,
  render
}
