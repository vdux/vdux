/**
 * Imports
 */

import element from '../../element'
import Ripples from './ripples'

/**
 * Button
 */

function render ({props, children}) {
  let addRipple

  return (
    <button {...props} onClick={[props.onClick, e => addRipple(e)]}>
      {children}
      <Ripples ref={_addRipple => addRipple = _addRipple} />
    </button>
  )
}

/**
 * Exports
 */

export default {
  render
}
