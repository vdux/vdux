/**
 * Imports
 */

import element from '../../element'
import Tick from './tick'

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

function render ({props, path}) {
  return (
    <Tick done={circleDone} onEnd={props.onEnd}>
      {t => <div style={circle(t, props)}></div>}
    </Tick>
  )
}

/**
 * Animation
 */

function circle (t, {x, y}) {
  const size = getSize(t)

  return {
    ...defaultStyle,
    left: x - (size / 2) + 'px',
    top: y - (size / 2) + 'px',
    width: size + 'px',
    height: size + 'px'
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
  render
}
