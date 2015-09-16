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

  function bind (name) {
    rootNode.addEventListener(name, e => listener(name, e), true)
  }

  function listener(name, e) {
    bubble(name, e.target, e)
  }

  function bubble (name, target, e) {
    const es = EvStore(target)
    const handler = es[name]

    if (handler) {
      dispatch(handler(e))
    }

    if (target.parentNode && target.parentNode !== rootNode) {
      bubble(name, target.parentNode, e)
    }
  }
}

/**
 * Exports
 */

export default delegator
