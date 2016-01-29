/**
 * Imports
 */

import {createStore, applyMiddleware} from 'redux'
import local, {mount} from 'virtex-local'
import component from 'virtex-component'
import string from 'virtex-string'
import virtex from 'virtex'

/**
 * vdux
 */

function vdux ({middleware = [], reducer, initialState = {}, app, ready = () => true}) {
  /**
   * Create redux store
   */

  const store = applyMiddleware(string, local('ui'), component(), ...middleware)(createStore)(mount('ui', reducer), initialState)

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
        resolve({html, vtree, state})
        unsub()
      }
    }
  })
}

/**
 * Exports
 */

export default vdux
