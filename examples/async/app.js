/**
 * Imports
 */

import h from 'virtual-dom/h'
import {requestPosts, selectReddit} from './actions'
import Posts from './components/posts'
import Picker from './components/picker'

/**
 * App
 */

function App (props) {
  const {reddit, posts, loading, lastUpdated} = props

  return h('div', null, [
    Picker({value: reddit, onChange: selectReddit, options: ['reactjs', 'frontend']}),
    h('p', null, [
      LastUpdated({time: lastUpdated}),
      loading
        ? null
        : RefreshButton({onClick: e => requestPosts(reddit)})
    ]),
    loading && posts.length === 0
      ? h('h2', null, ['Loading...'])
      : null,
    !loading && posts.length === 0
      ? h('h2', null, ['Empty.'])
      : null,
    posts.length > 0
      ? h('div', {style: {opacity: loading ? 0.5 : 1}}, [Posts(posts)])
      : null
  ])
}

/**
 * Components
 */

function LastUpdated ({time}) {
  const str = new Date(time).toLocaleTimeString()
  return h('span', null, [`Last updated at ${str}. `])
}

function RefreshButton ({onClick}) {
  return h('a', {href: '#', 'ev-click': onClick}, ['Refresh'])
}

/**
 * Exports
 */

export default App
