/**
 * Imports
 */

import vdux from '../../src'
import app from './app'
import createStore from './store'

/**
 * Setup store
 */

const store = createStore({
  reddit: 'reactjs',
  posts: []
})

/**
 * App
 */

document.addEventListener('DOMContentLoaded', () => vdux(store, app, document.body))
