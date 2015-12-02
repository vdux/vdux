/**
 * Imports
 */

import element from 'virtex-element'

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
