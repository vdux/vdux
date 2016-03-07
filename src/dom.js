/**
 * Imports
 */

import applyMiddleware from 'redux/lib/applyMiddleware'
import delegant, {delegateGlobal} from 'delegant'
import createStore from 'redux/lib/createStore'
import dom, {reconstitute} from 'virtex-dom'
import local, {mount} from 'virtex-local'
import component from 'virtex-component'
import empty from '@f/empty-element'
import isObject from '@f/is-object'
import createQueue from '@f/queue'
import forEach from '@f/foreach'
import multi from 'redux-multi'
import falsy from 'redux-falsy'
import thunk from 'redux-thunk'
import virtex from 'virtex'
import map from '@f/map'

/**
 * vdux
 */

function vdux ({middleware = [], reducer, initialState = {}, app, node = document.body, prerendered}) {
  /**
   * Create redux store
   */

  let vtree
  let forceUpdate = false
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

  /**
   * Empty the root node
   */

  if (!prerendered) {
    empty(node)
  }

  /**
   * Create the Virtual DOM <-> Redux cycle
   */

  const unsubscribe = store.subscribe(sync)
  const undelegate = delegant(document, maybeDispatch)
  const undelegateGlobal = delegateGlobal(window, maybeDispatch)

  /**
   * Render the VDOM tree
   */

  vtree = render()
  prerendered
    ? create(vtree, 'a', node.firstChild)
    : node.appendChild(create(vtree).element)

  // Run any pending afterRender lifecycle hooks
  postRenderQueue.flush()

  return {
    replace (_app, _reducer) {
      app = _app
      reducer = _reducer
      store.replaceReducer(mount('ui', reducer))
      syncNow(true)
    },

    dispatch (action) {
      store.dispatch(action)
    },

    stop () {
      unsubscribe()
      undelegate()
      undelegateGlobal()
    }
  }

  function maybeDispatch (action) {
    return action && store.dispatch(action)
  }

  /**
   * Render a new virtual dom
   */

  function render () {
    return app(store.getState())
  }

  /**
   * Sync the virtual dom and the actual dom
   */

  let pending = false

  function sync () {
    // Prevent re-entrant renders
    if (pending) return
    pending = true

    setTimeout(syncNow)
  }

  function syncNow (_forceUpdate) {
    pending = false
    forceUpdate = _forceUpdate

    const newTree = render()

    update(vtree, newTree)
    updateDirty()
    postRenderQueue.flush()

    forceUpdate = false
    vtree = newTree
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
