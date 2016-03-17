/**
 * Imports
 */

import createHandler from '@f/event-handler'
import element from 'virtex-element'
import forEach from '@f/foreach'
import EvStore from 'ev-store'

/**
 * Create a global listener component
 */

function globalListener (node = {}) {
  let store

  /**
   * onCreate
   */

  function onCreate ({path, props}) {
    // Allow node to be passed in as a function so that we can late-bind it, for
    // things like document.body, which are only created after the DOM is ready
    store = store || EvStore('function' === typeof node ? node() : node)
    listen(path, props)
  }

  /**
   * Special window component
   */

  function render ({props, children, path}) {
    if (children.length > 1) {
      throw new Error('Window component may have only 1 child')
    }

    return children[0] || <span class='global-listener' />
  }

  /**
   * onUpdate - Clear and reset the handlers
   */

  function onUpdate (prev, next) {
    clear(prev.path)
    listen(next.path, next.props)
  }

  /**
   * onRemove - Clear all the handlers
   */

  function onRemove ({path}) {
    clear(path)
  }

  /**
   * Helpers
   */

  function clear (path) {
    forEach(name => {
      delete store[name][path]
    }, store[path])
    delete store[path]
  }

  function listen (path, props) {
    store[path] = []
    forEach((fn, key) => {
      const name = key.slice(2).toLowerCase() // onResize -> resize
      store[path].push(name)
      store[name] = store[name] || {}
      store[name][path] = createHandler(fn)
    }, props)
  }

  return {
    onCreate,
    render,
    onUpdate,
    onRemove
  }
}

/**
 * Exports
 */

export default globalListener
