/**
 * Imports
 */

import delegator from './delegator'
import {diff, patch, create} from 'virtual-dom'

/**
 * vdux
 */

function vdux (store, app, node) {
  store.subscribe(update)

  let tree = render()
  let rootNode = create(tree)

  node.appendChild(rootNode)

  // Set delegator on the node *above* our actual node
  // so that it doesn't change
  delegator(store.dispatch, node)

  function update () {
    const newTree = render()

    rootNode = patch(rootNode, diff(tree, newTree))
    tree = newTree
  }

  function render () {
    return app(store.getState())
  }
}

/**
 * Exports
 */

export default vdux
