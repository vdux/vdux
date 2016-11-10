/**
 * Imports
 */

import {component, element, Document} from '../../..'

/**
 * <Dropdown/>
 */

export default component({
  initialState: {
    open: false
  },

  render ({children, state, actions, props}) {
    const {btn} = props
    const {open} = state
    const {toggle, close} = actions

    return (
      <div>
        <div onClick={toggle}>{btn}</div>
        {
          open && (
            <Document onClick={close}>
              <ul class='dropdown'>
                {children.map(item => <li>{item}</li>)}
              </ul>
            </Document>
          )
        }
      </div>
    )
  },

  reducer: {
    toggle: state => ({open: !state.open}),
    close: state => ({open: false})
  }
})
