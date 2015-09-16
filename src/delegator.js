/**
 * Imports
 */

import EvStore from 'ev-store'

/**
 * Events
 */

const events = [
  "blur", "change", "click",  "contextmenu", "dblclick",
  "error","focus", "focusin", "focusout", "input", "keydown",
  "keypress", "keyup", "load", "mousedown", "mouseup",
  "resize", "select", "submit", "touchcancel",
  "touchend", "touchstart", "unload"
]

/**
 * Delegator
 */

function delegator (dispatch, rootNode) {
  events.forEach(bind)

  function bind (event) {
    rootNode.addEventListener(event, e => listener(name, e), true)
  }

  function listener(name, e) {
    const handler = EvStore(e.)
    bubble(e)
  }

  function bubble (name, target, e) {
    const handler = EvStore(target)[type]

    if (handler) {
      dispatch(handler(e))
    }

    target.parentNode && bubble(name, target.parentNode, e)
  }
}

/**
 * Exports
 */

export default delegator
