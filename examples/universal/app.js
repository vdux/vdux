/**
 * Imports
 */

import {component, element} from '../..'

/**
 * App
 */

export default component({
  initialState: ({props}) => ({
    counter: props.initialValue
  }),

  render ({state, actions}) {
    return (
      <div>
        <div onClick={[actions.increment]}>Counter: {state.counter}</div>
        <p>
          <i>Append ?counter=&lt;n&gt; to the url to see the server-side rendering in action</i>
        </p>
      </div>
    )
  },

  reducer: {
    increment: state => ({
      counter: state.counter + 1
    })
  }
})
