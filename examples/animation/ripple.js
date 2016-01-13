/**
 * Imports
 */

import {raf} from 'redux-effects-timeout'
import element from '../../element'


/**
 * Style
 */

const width = 50
const height = 50
const defaultStyle = {
  position: 'absolute',
  borderRadius: '50%',
  backgroundColor: 'red',
  width,
  height,
  overflow: 'hidden',
  opacity: 0.2
}

/**
 * Ripple
 */

function afterMount ({path, props}) {
  let t = 0
  return raf(function animator () {
    const styles = ripple(t++, props.x, props.y)

    if (t < width) {
      applyStyles(document.getElementById(path), styles)
      return raf(animator)
    } else {
      return props.onEnd()
    }
  })
}

function render ({props, path}) {
  const {x, y} = props
  return <div id={path} style={{...defaultStyle, ...center(x, y)}}></div>
}

/**
 * Animation
 */

function center (t, x, y) {
  return {
    left: x - (t / 2),
    top: y - (t / 2)
  }
}

function ripple (t, x, y) {
  const size = t * 4

  return {
    width: size,
    height: size,
    ...center(size, x, y)
  }
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

export default {
  afterMount,
  render
}
