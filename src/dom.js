/**
 * Imports
 */

import applyMiddleware from 'redux/lib/utils/applyMiddleware'
import createStore from 'redux/lib/createStore'
import component from 'virtex-component'
import ephemeral from 'redux-ephemeral'
import empty from '@f/empty-element'
import local from 'virtex-local'
import delegant from 'delegant'
import dom, {reconstitute} from 'virtex-dom'
import virtex from 'virtex'

/**
 * vdux
 */

function vdux ({middleware = [], reducer, initialState = {}, app, node = document.body, vtree}) {
  /**
   * Create redux store
   */

  const store = applyMiddleware(dom, local('ui'), component, ...middleware)(createStore)(ephemeral('ui', reducer), initialState)

  /**
   * Initialize virtex
   */

  const {create, update} = virtex(store.dispatch)

  /**
   * Empty the root node
   */

  if (!vtree) {
    empty(node)
  }

  /**
   * Render the VDOM tree
   */

  if (vtree) {
    reconstitute(vtree, node.firstChild)
    syncNow()
  } else {
    vtree = render()
    node.appendChild(create(vtree).element)
  }

  /**
   * Create the Virtual DOM <-> Redux cycle
   */

  store.subscribe(sync)
  delegant(node, action => action && store.dispatch(action))

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

  function syncNow () {
    pending = false

    const newTree = render()
    update(vtree, newTree)
    vtree = newTree
  }
}

/**
 * Exports
 */

export default vdux
