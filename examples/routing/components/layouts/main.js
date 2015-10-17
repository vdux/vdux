/**
 * Imports
 */

import element from 'vdom-element'

/**
 * Render
 */

function render ({nav, children}) {
  return (
    <div>
      <div>
        {nav}
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}

/**
 * Exports
 */

export default render
