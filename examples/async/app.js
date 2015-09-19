/**
 * Imports
 */

import element from 'vdom-element'
import {requestPosts, selectReddit} from './actions'
import Posts from './components/posts'
import Picker from './components/picker'

/**
 * beforeMount
 */

function beforeMount (props) {
  return requestPosts(props.reddit)
}

/**
 * beforeUpdate
 */

function beforeUpdate (prevProps, nextProps) {
  if (prevProps.reddit !== nextProps.reddit) {
    return requestPosts(nextProps.reddit)
  }
}

/**
 * Render
 */

function render (props) {
  const {reddit, posts, loading, lastUpdated} = props
  const lastUpdatedStr = new Date(lastUpdated).toLocaleTimeString()

  return (
    <div>
      <Picker value={reddit} onChange={selectReddit} options={['reactjs', 'frontend']} />
      <p>
        <span>
          {`Last updated at ${lastUpdatedStr}`}.{' '}
        </span>
        <a href='#' ev-click={() => requestPosts(reddit)}>
          Refresh
        </a>
      </p>
      {loading && <h2>Loading...</h2>}
      {!loading && posts.length === 0 && <h2>Empty.</h2>}
      <Posts posts={posts} />
    </div>
  )
}

/**
 * Exports
 */

export default {
  beforeMount,
  beforeUpdate,
  render
}
