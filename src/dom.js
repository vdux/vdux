/**
 * Imports
 */

import applyMiddleware from 'redux/lib/applyMiddleware'
import delegant, {delegateGlobal} from 'delegant'
import createStore from 'redux/lib/createStore'
import dom, {reconstitute} from 'virtex-dom'
import isDomLoaded from '@f/is-dom-loaded'
import local, {mount} from 'virtex-local'
import component from 'virtex-component'
import empty from '@f/empty-element'
import isObject from '@f/is-object'
import createQueue from '@f/queue'
import debounce from '@f/debounce'
import forEach from '@f/foreach'
import multi from 'redux-multi'
import falsy from 'redux-falsy'
import thunk from 'redux-thunk'
import equal from '@f/equal'
import virtex from 'virtex'
import map from '@f/map'

/**
 * vdux
 */

function vdux (opts = {}) {
  let {middleware = [], reducer = state => state, initialState = {}, node, prerendered} = opts

  /**
   * Create redux store
   */

  let prevTree
  let context = {}
  let forceUpdate = false
  let rendering = false
  let delegated = false
  const dirty = {}
  const components = {}
  const postRenderQueue = createQueue()
  const store = applyMiddleware(
    falsy,
    multi,
    dom,
    local('ui', dirty),
    component({
      components,
      postRender: postRenderQueue.add,
      getContext () {
        return context
      },
      ignoreShouldUpdate () {
        return forceUpdate
      }
    }),
    thunk,
    ...middleware
  )(createStore)(mount('ui', reducer), initialState)

  /**
   * Initialize virtex
   */

  const {create, update, updatePaths} = virtex(store.dispatch)

  return {
    replaceReducer (_reducer) {
      reducer = _reducer
      store.replaceReducer(mount('ui', reducer))
    },

    dispatch (action) {
      store.dispatch(action)
    },

    subscribe (fn) {
      if (!isDomLoaded()) {
        throw new Error ('vdux: Please wait until the document (i.e. DOMContentLoaded) is ready before calling subscribe')
      }

      const debouncedFn = debounce(() => {
        rendering
          ? debouncedFn()
          : fn(store.getState())
      })

      /**
       * Create the Virtual DOM <-> Redux cycle
       */

      const stop = []
      stop.push(store.subscribe(debouncedFn))

      if (!delegated) {
        stop.push(delegant(document, store.dispatch))
        stop.push(delegateGlobal(window, store.dispatch))
        delegated = true
      }

      /**
       * Initial render
       */

      debouncedFn()
      return () => stop.forEach(fn => fn())
    },

    render (tree, _context, force) {
      // If there is a context update, we need
      // to do a forced full re-render
      if (!equal(context, _context)) {
        context = _context
        force = true
      }

      forceUpdate = force
      rendering = true

      prevTree
        ? updateDom(prevTree, tree)
        : createDom(tree)

      prevTree = tree
      forceUpdate = false
      rendering = false
    }
  }

  /**
   * Sync the virtual dom and the actual dom
   */

  function createDom (tree) {
    node = node || document.body

    if (!prerendered) {
      empty(node)
      node.appendChild(create(tree).element)
    } else {
      create(tree, 'a', node.firstChild)
    }

    // Run any pending afterRender lifecycle hooks
    postRenderQueue.flush()
    return node.firstChild
  }

  function updateDom (oldTree, newTree) {
    update(oldTree, newTree)
    updateDirty()
    postRenderQueue.flush()
    return node.firstChild
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
