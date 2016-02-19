/**
 * Imports
 */

import combineReducers from '@f/combine-reducers'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import element from '../../../element'
import Document from '../../../document'

/**
 * initialState
 */

function initialState () {
  return {
    open: false
  }
}

/**
 * Render
 */

function render ({children, state, local, props}) {
  const {open} = state

  if (props.ref) props.ref(local(toggle))
  if (!open) return <span/>

  return (
    <Document onClick={local(close)}>
      <ul class='dropdown'>
        {children.map(item => <li>{item}</li>)}
      </ul>
    </Document>
  )
}

/**
 * Local actions
 */

const toggle = createAction('TOGGLE')
const close = createAction('CLOSE')

/**
 * Reducer
 */

const reducer = combineReducers({
  open: handleActions({
    [toggle]: state => !state,
    [close]: () => false
  })
})

/**
 * Exports
 */

export default {
  initialState,
  render,
  reducer,
  toggle
}
