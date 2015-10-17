/**
 * Imports
 */

import element from 'vdom-element'
import MainLayout from '../layouts/main'
import Nav from '../nav'
import Posts from '../posts'

/**
 * Render
 */

function render ({posts, postsAreLoading}) {
  return (
    <MainLayout nav={<Nav />}>
      <Posts posts={posts} />
    </MainLayout>
  )
}

/**
 * Exports
 */

export default render
