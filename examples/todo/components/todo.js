/**
 * Imports
 */

import localize from 'vdux-local'
import element from 'vdom-element'
import Dropdown from './dropdown'

/**
 * Render
 */

function render (props) {
  const dropdownKey = props.key + '.dropdown'

  return (
    <li>
      <span>{props.text}</span>
      <span ev-click={e => Dropdown.toggle(dropdownKey)} style={{marginLeft: '12px', color: 'blue'}} >
        options
      </span>
      <Dropdown {...props.dropdown} key={dropdownKey}>
        <div>Item 1</div>
        <div>Item 2</div>
      </Dropdown>
    </li>
  )
}

/**
 * Exports
 */

export default localize({
  render
})
