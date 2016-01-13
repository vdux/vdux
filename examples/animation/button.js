/**
 * Imports
 */

import element from '../../element'
import Ripples from './ripples'

/**
 * Button
 */

function render ({props, children, ref}) {
  return (
    <button {...props} onClick={[props.onClick, ref.to('ripple', Ripples.addRipple)]}>
      {children}
      <Ripples ref={ref.as('ripple')} />
    </button>
  )
}

/**
 * Exports
 */

export default {
  render
}
