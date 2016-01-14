/**
 * Imports
 */

import element from '../../element'
import animate from './animate'

/**
 * Style
 */

const maxSize = 200
const defaultStyle = {
  position: 'absolute',
  borderRadius: '50%',
  backgroundColor: 'red',
  overflow: 'hidden',
  opacity: 0.2
}

/**
 * Ripple
 */

function onCreate ({path, props}) {
  return animate(circle, circleDone, () => document.getElementById(path), props)
}

function render ({props, path}) {
  const {x, y} = props
  return <div id={path} style={defaultStyle}></div>
}

/**
 * Animation
 */

function circle (t, {x, y}) {
  const size = getSize(t)

  return {
    left: x - (size / 2),
    top: y - (size / 2),
    width: size,
    height: size
  }
}

function circleDone (t) {
  return getSize(t) >= maxSize
}

function getSize (t) {
  return t * 5
}

/**
 * Exports
 */

export default {
  onCreate,
  render
}
