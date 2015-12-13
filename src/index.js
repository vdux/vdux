/**
 * Imports
 */

import delegant from 'delegant'
import virtex from 'virtex'

/**
 * vdux
 */

function vdux (store, app, node) {
  const {subscribe, dispatch, getState} = store

  /**
   * Initialize virtex
   */

  const {create, update} = virtex(dispatch)

  /**
   * Render the VDOM tree
   */

  let tree = render()
  let rootNode = create(tree)
  node.appendChild(rootNode)

  /**
   * Create the Virtual DOM <-> Redux cycle
   */

  const unsubscribe = subscribe(sync)
  const undelegate = delegant(node, action => action && dispatch(action))

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
    return app(getState())
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
    const newRootNode = update(tree, newTree, rootNode)

    if (newRootNode !== rootNode) {
      node.replaceChild(newRootNode, rootNode)
      rootNode = newRootNode
    }

    tree = newTree
  }
}

/**
 * Exports
 */

export default vdux
