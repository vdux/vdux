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
 * initialState
 */

const initialState = {
  reddit: 'reactjs',
  posts: []
}

/**
 * Initialize
 */

const {subscribe, render} = vdux({middleware, reducer, initialState})

domready(() => {
  subscribe(state => {
    render(<App {...state} />)
  })
})
