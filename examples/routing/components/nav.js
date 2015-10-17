/**
 * Imports
 */

import element from 'vdom-element'

/**
 * Render
 */

function render ({url}) {
  return (
    <div>
      <a href='/'>Home</a>
      <a href='/posts'>Posts</a>
      <a href='/users'>Users</a>
    </div>
  )
}

/**
 * Exports
 */

export default render
