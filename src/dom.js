/**
 * Imports
 */

import applyMiddleware from 'redux/lib/applyMiddleware'
import component, {forceUpdate} from 'virtex-component'
import delegant, {delegateGlobal} from 'delegant'
import {ephemeralReducer} from 'redux-ephemeral'
import createStore from 'redux/lib/createStore'
import virtex, {findDOMNode} from 'virtex'
import rafDebounce from '@f/raf-debounce'
import empty from '@f/empty-element'
import createQueue from '@f/queue'
import domready from '@f/domready'
import forEach from '@f/foreach'
import falsy from 'redux-falsy'
import thunk from 'redux-thunk'
import multi from 'redux-multi'
import dom from 'virtex-dom'
import flo from 'redux-flo'

/**
 * vdux
 */

function vdux (app, opts = {}) {
  let {middleware = [], initialState, node, prerendered, beforeRender, afterRender} = opts

  /**
   * Create redux store
   */

  let prevTree
  let rendering = false
  let delegated = false
  const dirty = {}
  const components = {}
  const postRenderQueue = createQueue()
  const store = applyMiddleware(
    falsy,
    dom,
    component({
      components,
      dirty,
      postRender: postRenderQueue.add,
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

  const {create, update, updatePaths} = virtex(store.dispatch)
  let unsubscribe

  domready(() => unsubscribe = subscribe(state => render(app(state))))

  return {
    dispatch (action) {
      return store.dispatch(action)
    },

    getState () {
      return store.getState()
    },

    stop () {
      unsubscribe()
    },

    forceRerender
  }

  function forceRerender () {
    store.dispatch(forceUpdate())
    render(app(store.getState()))
  }

  function subscribe (fn) {
    const debouncedFn = rafDebounce(() => {
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
      stop.push(delegant(document, handleAction))
      stop.push(delegateGlobal(window, handleAction))
      delegated = true

      function handleAction (handler, e) {
        if (handler) {
          const action = handler(e)

          if (action) {
            store.dispatch(action)
          }
        }
      }
    }

    /**
     * Initial render
     */

    debouncedFn()
    return () => stop.forEach(fn => fn())
  }

  function render (tree) {
    beforeRender && beforeRender()

    rendering = true

    prevTree
      ? updateDom(prevTree, tree)
      : createDom(tree)

    prevTree = tree

    // Run any pending afterRender lifecycle hooks
    var nextTicks = postRenderQueue.flush()

    // Give afterRender hooks a guaranteed way to execute some code
    // on the next tick but before the next render
    setTimeout(() => {
      forEach(function run (fn) {
        if ('function' === typeof fn) fn()
        if (Array.isArray(fn)) forEach(run, fn)
      }, nextTicks)

      rendering = false
    })

    afterRender && afterRender()
    return node.firstChild
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

    return node.firstChild
  }

  function updateDom (oldTree, newTree) {
    update(oldTree, newTree)
    updateDirty()
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
