/**
 * Imports
 */

import h from 'virtual-dom/h'

/**
 * Posts
 */

function Posts (posts) {
  return h('div', null, [
    posts.map(post => h('li', null, [post.title]))
  ])
}

/**
 * Exports
 */

export default Posts
