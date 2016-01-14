/**
 * Imports
 */

import {requestPosts, selectReddit} from './actions'
import Picker from './components/picker'
import Posts from './components/posts'
import element from '../../element'

/**
 * onCreate
 */

function onCreate ({props}) {
  return requestPosts(props.reddit)
}

/**
 * onUpdate
 */

function onUpdate (prev, next) {
  if (prev.props.reddit !== next.props.reddit) {
    return requestPosts(next.props.reddit)
  }
}

/**
 * Render
 */

function render ({props}) {
  const {reddit, posts, loading, lastUpdated} = props
  const lastUpdatedStr = new Date(lastUpdated).toLocaleTimeString()

  return (
    <div>
      <Picker value={reddit} onChange={selectReddit} options={['reactjs', 'frontend']} />
      <p>
        <span>
          {`Last updated at ${lastUpdatedStr}`}.{' '}
        </span>
        <a href='#' onClick={() => requestPosts(reddit)}>
          Refresh
        </a>
      </p>
      {loading ? <h2>Loading...</h2> : ''}
      {!loading && posts.length === 0 ? <h2>Empty.</h2> : ''}
      {!loading && posts.length > 0 ? <Posts posts={posts} />: ''}
    </div>
  )
}

/**
 * Exports
 */

export default {
  onCreate,
  onUpdate,
  render
}
