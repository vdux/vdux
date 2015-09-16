/**
 * Imports
 */

import Delegator from 'dom-delegator'
import {diff, patch, createElement} from 'virtual-dom'

/**
 * vdux
 */

function vdux (store, app, node) {
  store.subscribe(update)

  let tree = render()
  let rootNode = createElement(tree)

  node.appendChild(rootNode)

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
