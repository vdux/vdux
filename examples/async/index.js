/**
 * Imports
 */

import vdux from '../../src'
import createStore from './store'
import {handleOnce} from 'redux-effects-events'
import element from 'virtex-element'
import virtex from 'virtex'
import App from './app'

/**
 * Setup store
 */

const store = createStore({
  reddit: 'reactjs',
  posts: []
})

/**
 * App
 */

store.dispatch(handleOnce('domready', () => {
  vdux(store, virtex(store.dispatch), state => <App {...state} />, document.body)
}))
