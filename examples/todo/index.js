/**
 * Imports
 */

import middleware from './middleware'
import element from '../../element'
import domready from '@f/domready'
import reducer from './reducers'
import vdux from '../../src/dom'
import App from './app'

/**
 * initialState
 */

const initialState = {
  todos: []
}

/**
 * Initialize
 */

const {subscribe, render} = vdux({
  middleware,
  reducer,
  initialState
})

domready(() => {
  subscribe(state => {
    render(<App todos={state.todos} url={state.url} />)
  })
})
