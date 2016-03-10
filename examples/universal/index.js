/**
 * Imports
 */

import element from '../../element'
import domready from '@f/domready'
import vdux from '../../src/dom'
import reducer from './reducer'
import App from './app'

/**
 * App
 */

const {subscribe, render}  = vdux({
  reducer,
  initialState: window.__initialState__,
  prerendered: true
})

domready(() => {
  subscribe(state => {
    render(<App {...state} />)
  })
})
