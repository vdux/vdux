/**
 * Imports
 */

import {createStore, applyMiddleware} from 'redux'
import local, {mount} from 'virtex-local'
import component from 'virtex-component'
import string from 'virtex-string'
import multi from 'redux-multi'
import falsy from 'redux-falsy'
import equal from '@f/equal'
import virtex from 'virtex'

/**
 * vdux
 */

function vdux (opts = {}) {
  const {middleware = [], reducer = state => state, initialState = {}} = opts

  /**
   * Create redux store
   */

  let context
  let forceUpdate = false

  const componentOpts = {
    getContext: () => context,
    ignoreShouldUpdate: () => forceUpdate
  }

  const store = applyMiddleware(falsy, multi, string, local('ui'), component(componentOpts), ...middleware)(createStore)(mount('ui', reducer), initialState)

  /**
   * Initialize virtex
   */

  const {create, update} = virtex(store.dispatch)

  /**
   * Create the Virtual DOM <-> Redux cycle
   */

  let prev

  return {
    subscribe (fn) {
      const deferred = () => setTimeout(() => fn(store.getState()))
      const stop = store.subscribe(deferred)
      deferred()
      return stop
    },

    render (tree, _context) {
      if (!equal(context, _context)) {
        context = _context
        forceUpdate = true
      }

      const html = (prev ? update(prev, tree) : create(tree)).element
      prev = tree
      forceUpdate = false

      return html
    }
  }
}

/**
 * Exports
 */

export default vdux
