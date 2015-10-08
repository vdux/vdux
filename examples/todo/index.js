/**
 * Imports
 */

import vdux from '../../src'
import app from './app'
import createStore from './store'
import {listen} from 'virtual-component'
import {handleOnce} from 'redux-effects-events'
import element from 'vdom-element'
import App from './app'
import {initializeRouter, persistTodos, hydrateTodos} from './actions'

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
  store.dispatch(hydrateTodos())
  store.subscribe(state => store.dispatch(persistTodos(store.getState())))
  store.dispatch(initializeRouter())
  vdux(store, state => <App key='app' state={state.app} {...state} />, document.body)
}))
