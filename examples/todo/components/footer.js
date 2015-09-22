/**
 * Imports
 */

import element from 'vdom-element'

/**
 * Filters
 */

const filters = ['All', 'Active', 'Completed']

/**
 * Render
 */

function render (props) {
  const {count = 0} = props

  return (
    <footer class='footer'>
      <span class='todo-count'>
        <strong>{count}</strong> items left
      </span>
      <ul class='filters'>
        {
          filters.map(filter => <li><span>{filter}</span></li>)
        }
      </ul>
      <button class='clear-completed'>
        Clear Completed
      </button>
    </footer>
  )
}

/**
 * Exports
 */

export default render
