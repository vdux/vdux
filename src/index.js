/**
 * Imports
 */

import delegant from 'delegant'

/**
 * vdux
 */

function vdux (store, {create, update}, app, node) {
  /**
   * Create the Virtual DOM <-> Redux cycle
   */

  const unsubscribe = store.subscribe(sync)
  const undelegate = delegant(node, action => action && store.dispatch(action))

  /**
   * Render the VDOM tree
   */

  let tree = render()
  let rootNode = create(tree)
  node.appendChild(rootNode)

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
    // Ensure we don't get re-entrant/duplicate renders
    if (pending) return
    pending = true

    setTimeout(() => {
      pending = false
      const newTree = render()
      update(tree, newTree, rootNode)
      tree = newTree
    })
  }
}

/**
 * Exports
 */

export default vdux
