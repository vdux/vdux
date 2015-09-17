/**
 * Imports
 */

import h from 'virtual-dom/h'

/**
 * Picker
 */

function Picker (props) {
  const {value, onChange, options} = props

  return h('span', null, [
    h('h1', null, [value]),
    h('select', {'ev-change': e => onChange(e.target.value)},
      options
        .map(opt => h('option', {value: opt, key: opt}, [opt])))
  ])
}

/**
 * Exports
 */

export default Picker
