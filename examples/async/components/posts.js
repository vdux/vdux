/**
 * Imports
 */

import element from 'vdom-element'

/**
 * Render
 */

function render ({posts = []}) {
  return (
    <div>
      {posts.map(post => <li>{post.title}</li>)}
    </div>
  )
}

/**
 * Exports
 */

export default {
  render
}
