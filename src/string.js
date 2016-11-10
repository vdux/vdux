/**
 * Imports
 */

import component, {forceUpdate} from 'virtex-component'
import {createStore, applyMiddleware} from 'redux'
import {ephemeralReducer} from 'redux-ephemeral'
import string from 'virtex-string'
import appReady from './app-ready'
import forEach from '@f/foreach'
import multi from 'redux-multi'
import falsy from 'redux-falsy'
import thunk from 'redux-thunk'
import equal from '@f/equal'
import flo from 'redux-flo'
import virtex from 'virtex'

/**
 * vdux
 */

function vdux (app, opts = {}) {
  return new Promise((resolve, reject) => {
    let html
    let prev

    const {middleware = [], reducer = state => state, initialState, awaitReady} = opts

    /**
     * Create redux store
     */

    const dirty = {}
    const components = {}

    const store = applyMiddleware(
      falsy,
      string,
      appReady((data = {}) => {
        unsubscribe()
        const state = store.getState()
        setImmediate(() => resolve({
          ...data,
          html,
          state
        }))
      }),
      component({
        dirty,
        components,
        forceRerender
      }),
      multi,
      thunk,
      flo(),
      ...middleware
    )(createStore)(ephemeralReducer, initialState)

    /**
     * Initialize virtex
     */

    const {create, update} = virtex(store.dispatch)

    /**
     * Create the Virtual DOM <-> Redux cycle
     */

    const unsubscribe = subscribe(state => {
      try {
        html = render(app(state))

        if (!awaitReady) {
          unsubscribe()
          resolve({html, state})
        }
      } catch (err) {
        unsubscribe()
        reject(err)
      }
    })

    function subscribe (fn) {
      const deferred = () => setTimeout(() => fn(store.getState()))
      const stop = store.subscribe(deferred)
      deferred()
      return stop
    }

    function render (tree) {
      const html = (prev ? updateString(prev, tree) : create(tree)).element
      prev = tree

      return html
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

    function forceRerender () {
      store.dispatch(forceUpdate())
      html = render(app(store.getState()))
    }
  })
}

/**
 * Exports
 */

export default vdux
