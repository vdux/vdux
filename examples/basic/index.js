/**
 * Imports
 */

import vdux from '../../src'
import app from './app'
import store from './store'

/**
 * App
 */

document.addEventListener('DOMContentLoaded', () => vdux(store, app, document.body))
