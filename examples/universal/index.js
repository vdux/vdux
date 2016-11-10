/**
 * Imports
 */

import domready from '@f/domready'
import vdux from '../../src/dom'
import {element} from '../..'
import App from './app'

/**
 * App
 */

const {subscribe, render}  = vdux({
  initialState: window.__initialState__,
  prerendered: true
})

domready(() => {
  subscribe(state => {
    render(<App {...state} />)
  })
})
