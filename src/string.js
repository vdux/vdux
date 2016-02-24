/**
 * Imports
 */

import {createStore, applyMiddleware} from 'redux'
import local, {mount} from 'virtex-local'
import component from 'virtex-component'
import string from 'virtex-string'
import multi from 'redux-multi'
import falsy from 'redux-falsy'
import virtex from 'virtex'

/**
 * vdux
 */

function vdux ({middleware = [], reducer, initialState = {}, app, ready = () => true}) {
  /**
   * Create redux store
   */

  const store = applyMiddleware(falsy, multi, string, local('ui'), component(), ...middleware)(createStore)(mount('ui', reducer), initialState)

  /**
   * Initialize virtex
   */

  const {create, update} = virtex(store.dispatch)

  /**
   * Create the Virtual DOM <-> Redux cycle
   */

  return new Promise((resolve, reject) => {
    run()
    const unsub = store.subscribe(() => setTimeout(run))

    function run () {
      try {
        const state = store.getState()
        const vtree = app(state)
        const html = render(vtree)

        if (ready(state)) {
          resolve({html, vtree, state})
          unsub()
        }
      } catch (e) {
        reject(e)
      }
    }
  })

  let prev
  function render (vtree) {
    const result = (prev ? update(prev, vtree) : create(vtree)).element
    prev = vtree
    return result
  }
}

/**
 * Exports
 */

export default vdux
