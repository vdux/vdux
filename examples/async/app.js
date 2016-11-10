/**
 * Imports
 */

import {element, component} from '../../'
import {fetch} from 'redux-effects-fetch'
import Picker from './components/picker'
import Posts from './components/posts'

/**
 * <App/>
 */

export default component({
  initialState: {
    reddit: 'reactjs',
    loading: true,
    posts: []
  },

  onCreate ({state, actions}) {
    return [actions.requestPosts, state.reddit]
  },
  onUpdate (prev, next) {
    if (prev.state.reddit !== next.state.reddit) {
      return [next.actions.requestPosts, next.state.reddit]
    }
  },

  effects: {
    * requestPosts ({receivedPosts, requestingPosts}, reddit) {
      const json = yield fetch(`http://www.reddit.com/r/${reddit}.json`)
      yield [requestingPosts]
      yield [receivedPosts, json.data.children.map(child => child.data), +new Date]
    }
  },

  reducer: {
    requestingPosts: state => ({
      loading: true
    }),
    receivedPosts: (state, [posts, lastUpdated]) => ({
      loading: false,
      lastUpdated,
      posts
    }),
    selectReddit: (state, [e]) => ({
      reddit: e.target.value
    })
  },

  render ({state, actions}) {
    const {reddit, posts, loading, lastUpdated} = state
    const {requestPosts, selectReddit} = actions
    const lastUpdatedStr = new Date(lastUpdated).toLocaleTimeString()

    return (
      <div>
        <Picker value={reddit} onChange={selectReddit} options={['reactjs', 'frontend']} />
        <p>
          <span>
            {`Last updated at ${lastUpdatedStr}`}.{' '}
          </span>
          <a href='#' onClick={[requestPosts, reddit]}>
            Refresh
          </a>
        </p>
        {loading && <h2>Loading...</h2>}
        {!loading && posts.length === 0 && <h2>Empty.</h2>}
        {!loading && posts.length > 0 && <Posts posts={posts} />}
      </div>
    )
  }
})
