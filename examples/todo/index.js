/**
 * Imports
 */

import vdux from '../../src'
import createStore from './store'
import {handleOnce} from 'redux-effects-events'
import element from 'virtex-element'
import virtex from 'virtex'
import App from './app'
import {initializeApp} from './actions'

/**
 * Setup store
 */

const store = createStore({
  todos: [],
  app: {}
})

/**
 * App
 */

store.dispatch(handleOnce('domready', () => {
  store.dispatch(initializeApp())
  vdux(store, virtex(store.dispatch), state => <App todos={state.todos} url={state.url} />, document.body)
}))
