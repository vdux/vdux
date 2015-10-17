/**
 * Imports
 */

import vdux from '../../src'
import App from './app'
import configureStore from './store'
import {listen} from 'virtual-component'
import {handleOnce} from 'redux-effects-events'
import element from 'vdom-element'

/**
 * Setup store
 */

const store = configureStore({})

/**
 * Initialize
 */

store.dispatch(handleOnce('domready', () => {
  listen(store.dispatch)
  vdux(store, state => <App {...state} />, document.body)
}))
