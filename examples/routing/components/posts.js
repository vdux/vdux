/**
 * Imports
 */

import element from 'vdom-element'
import {fetchPosts} from '../actions'

/**
 * Before mount
 */

function beforeMount () {
  return fetchPosts()
}

/**
 * Render
 */

function render ({posts = []}) {
  return (
    <div>
      {
        posts.map(({title, body}) => (
          <div>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))
      }
    </div>
  )
}

/**
 * Exports
 */

export default {
  beforeMount,
  render
}
