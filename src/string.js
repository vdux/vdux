/**
 * Imports
 */

import {createStore, applyMiddleware} from 'redux'
import compose from '@f/compose-middleware'
import component from 'virtex-component'
import ephemeral from 'redux-ephemeral'
import terminal from './terminal'
import local from 'virtex-local'
import string from 'virtex-string'
import virtex from 'virtex'

/**
 * vdux
 */

function vdux (middleware, reducer, initialState, app, ready = () => true) {
  /**
   * Create redux store
   */

  const store = applyMiddleware(...middleware)(createStore)(ephemeral('ui', reducer), initialState)

  /**
   * Initialize virtex
   */

  const stack = compose([string, local('ui'), component])
  const {create} = virtex(stack(store)(terminal))

  /**
   * Render the VDOM tree
   */

  let tree = render()

  /**
   * Create the Virtual DOM <-> Redux cycle
   */

  const unsubscribe = store.subscribe(sync)

  return new Promise((resolve, reject) => {
    render()
    const unsub = store.subscribe(render)

    function render () {
      const state = store.getState()
      const html = create(app(state)).element

      if (ready(state)) {
        resolve(html)
        unsub()
      }
    }
  })
}

/**
 * Exports
 */

export default vdux
