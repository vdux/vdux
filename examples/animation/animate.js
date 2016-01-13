/**
 * Imports
 */

import {raf} from 'redux-effects-timeout'

/**
 * Animate
 */

function animate (tween, done, getElement, params) {
  let t = 0

  return raf(function animator () {
    const node = getElement()
    const styles = tween(t, params)

    if (!done(t++, params)) {
      applyStyles(node, styles)
      return raf(() => animator(node))
    } else {
      return params.onEnd && params.onEnd()
    }
  })
}

function applyStyles (node, styles = {}) {
  for (let key in styles) {
    const val = styles[key]
    node.style[key] = val
  }
}

/**
 * Exports
 */

export default animate
