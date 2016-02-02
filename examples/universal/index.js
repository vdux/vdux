/**
 * Imports
 */

import domready from '@f/domready'
import vdux from '../../src/dom'
import boot from './main'

/**
 * Initialize
 */

domready(() => boot(
  vdux,
  window.__initialState__,
  true
))
