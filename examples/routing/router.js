/**
 * Imports
 */

import enroute from 'enroute'
import element from 'vdom-element'
import Home from './components/pages/home'
import Posts from './components/pages/posts'
import NotFound from './components/pages/notFound'

/**
 * Routes
 */

const router = enroute({
  '/': home,
  '/posts': posts,
  '*': notFound
})

/**
 * Pages
 */

function home (params, props) {
  return <Home {...props} />
}

function posts (params, props) {
  return <Posts posts={props.posts} />
}

function notFound () {
  return <NotFound />
}

/**
 * Exports
 */

export default router
