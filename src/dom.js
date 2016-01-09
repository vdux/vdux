/**
 * Imports
 */

import {createStore, applyMiddleware} from 'redux'
import compose from '@f/compose-middleware'
import component from 'virtex-component'
import ephemeral from 'redux-ephemeral'
import empty from '@f/empty-element'
import terminal from './terminal'
import local from 'virtex-local'
import delegant from 'delegant'
import dom from 'virtex-dom'
import virtex from 'virtex'

/**
 * vdux
 */

function vdux (middleware, reducer, initialState, app, node) {
  /**
   * Create redux store
   */

  const store = applyMiddleware(...middleware)(createStore)(ephemeral('ui', reducer), initialState)

  /**
   * Initialize virtex
   */

  const stack = compose([dom, local('ui'), component])
  const {create, update} = virtex(stack(store)(terminal))

  /**
   * Empty the root node
   */

   empty(node)

  /**
   * Render the VDOM tree
   */

  let tree = render()
  let rootNode = create(tree).element
  node.appendChild(rootNode)

  /**
   * Create the Virtual DOM <-> Redux cycle
   */

  const unsubscribe = store.subscribe(sync)
  const undelegate = delegant(node, action => action && store.dispatch(action))

  /**
   * Return an unbind function
   */

  return () => {
    unsubscribe()
    undelegate()
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

  function syncNow () {
    pending = false

    const newTree = render()
    update(tree, newTree)
    tree = newTree
  }
}

/**
 * Exports
 */

export default vdux
