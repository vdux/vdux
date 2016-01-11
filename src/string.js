/**
 * Imports
 */

import {createStore, applyMiddleware} from 'redux'
import component from 'virtex-component'
import ephemeral from 'redux-ephemeral'
import string from 'virtex-string'
import local from 'virtex-local'
import virtex from 'virtex'

/**
 * vdux
 */

function vdux ({middleware = [], reducer, initialState = {}, app, ready = () => true}) {
  /**
   * Create redux store
   */

  const store = applyMiddleware(string, local('ui'), component, ...middleware)(createStore)(ephemeral('ui', reducer), initialState)

  /**
   * Initialize virtex
   */

  const {create} = virtex(store.dispatch)

  /**
   * Create the Virtual DOM <-> Redux cycle
   */

  return new Promise((resolve, reject) => {
    render()
    const unsub = store.subscribe(render)

    function render () {
      const state = store.getState()
      const vtree = app(state)
      const html = create(vtree).element

      if (ready(state)) {
        resolve({html, vtree})
        unsub()
      }
    }
  })
}

/**
 * Exports
 */

export default vdux
