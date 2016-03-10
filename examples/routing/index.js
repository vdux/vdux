/**
 * Imports
 */

import middleware from './middleware'
import element from '../../element'
import domready from '@f/domready'
import vdux from '../../src/dom'
import reducer from './reducer'
import App from './app'

/**
 * Initialize
 */

const {subscribe, render} = vdux({middleware, reducer})

domready(() => {
  subscribe(state => {
    render(<App {...state} />)
  })
})
