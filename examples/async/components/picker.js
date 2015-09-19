/**
 * Imports
 */

import element from 'vdom-element'

/**
 * Render
 */

function render (props) {
  const {value, onChange, options} = props

  return (
    <span>
      <h1>{value}</h1>
      <select ev-change={e => onChange(e.target.value)}>
        {options.map(opt => <option value={opt} key={opt}>{opt}</option>)}
      </select>
    </span>
  )
}

/**
 * Exports
 */

export default {
  render
}
