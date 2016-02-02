/**
 * Imports
 */

import element from '../../element'

/**
 * App
 */

function app ({props}) {
  return (
    <div>
      <div onClick={increment}>Counter: {props.counter}</div>
      <p>
        <i>Append ?counter=&lt;n&gt; to the url to see the server-side rendering in action</i>
      </p>
    </div>
  )
}

function increment () {
  return {
    type: 'INCREMENT'
  }
}

/**
 * Exports
 */

export default app
