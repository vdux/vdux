/**
 * Imports
 */

import vdux from '../../src'
import createStore from './store'
import {listen} from 'virtual-component'
import {handleOnce} from 'redux-effects-events'
import element from 'vdom-element'
import App from './app'
import {initializeApp} from './actions'

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
  store.dispatch(initializeApp())
  vdux(store, state => <App key='app' state={state.app} {...state} />, document.body)
}))
