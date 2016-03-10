/**
 * Imports
 */

import domready from '@f/domready'
import vdux from '../../src/dom'
import reducer from './reducer'
import app from './app'

/**
 * initialState
 */

const initialState = {
  counter: 0
}

/**
 * App
 */

const {subscribe, render} = vdux({reducer, initialState})
domready(() => {
  subscribe(state => {
    render(app(state))
  })
})
