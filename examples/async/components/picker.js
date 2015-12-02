/**
 * Imports
 */

import element from 'virtex-element'

/**
 * Render
 */

function render ({value, onChange, options}) {
  return (
    <span>
      <h1>{value}</h1>
      <select onChange={e => onChange(e.target.value)}>
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
