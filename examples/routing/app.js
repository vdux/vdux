/**
 * Imports
 */

import {initializeApp} from './actions'
import element from '../../element'
import router from './router'

/**
 * onCreate
 */

function onCreate () {
  return initializeApp()
}

/**
 * Render
 */

function render ({props}) {
  return router(props.url || '/', props)
}

/**
 * Exports
 */

export default {
  onCreate,
  render
}
