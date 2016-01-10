/**
 * Imports
 */

import element from '../../../element'

/**
 * Render
 */

function render ({props}) {
  const {posts = []} = props

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
