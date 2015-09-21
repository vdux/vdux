/**
 * Imports
 */

import vdux from '../../src'
import app from './app'
import createStore from './store'
import {listen} from 'virtual-component'
import {handleOnce} from 'declarative-events'
import element from 'vdom-element'
import App from './app'

/**
 * Setup store
 */

const store = createStore({
  todos: []
})

/**
 * App
 */

store.dispatch(handleOnce('domready', () => {
  listen(store.dispatch)
  vdux(store, state => <App {...state} key='app' />, document.body)
}))
