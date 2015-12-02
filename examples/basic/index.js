/**
 * Imports
 */

import vdux from '../../src'
import app from './app'
import store from './store'
import virtex from 'virtex'

/**
 * App
 */

document.addEventListener('DOMContentLoaded', () => vdux(
  store,
  virtex(store.dispatch),
  app,
  document.body
))
