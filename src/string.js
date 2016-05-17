/**
 * Imports
 */

import {createStore, applyMiddleware} from 'redux'
import local, {mount} from 'virtex-local'
import component from 'virtex-component'
import string from 'virtex-string'
import forEach from '@f/foreach'
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

  const dirty = {}
  const components = {}
  const store = applyMiddleware(
    falsy,
    multi,
    string,
    local('ui', dirty),
    component({
      components,
      getContext: () => context,
      ignoreShouldUpdate: () => forceUpdate
    }),
    ...middleware
  )(createStore)(mount('ui', reducer), initialState)

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

      const html = (prev ? updateString(prev, tree) : create(tree)).element
      prev = tree
      forceUpdate = false

      return html
    }
  }

  function updateString (prev, next) {
    next = update(prev, next)
    updateDirty()
    return next
  }

  function updateDirty () {
    forEach(path => {
      // Check that it's still dirty, since the re-rendering of a higher component
      // may cause one of the lower ones to get re-rendered
      if (dirty[path]) {
        const component = components[path]

        if (component) {
          const prev = {...component}

          // Clear cached vnodes/elements
          component.vnode = null
          update(prev, component, path)
        }
      }

      // Sort by shortest dirty paths first, so that if possible
      // we get some of the higher re-renders cleaning up some
      // of the lower ones
    }, Object.keys(dirty).sort((a, b) => a.length - b.length))
  }
}

/**
 * Exports
 */

export default vdux
