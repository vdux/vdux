/**
 * Imports
 */

import {element, component} from '../../..'

/**
 * Filters
 */

const filters = {
  All: '/',
  Active: '/active',
  Completed: '/completed'
}

/**
 * <Footer/>
 */

export default component({
  render ({props, context}) {
    const {itemsLeft = 0, completed = 0, active, clearCompleted} = props
    const itemStr = itemsLeft === 1 ? 'item' : 'items'

    return (
      <footer id='footer' class='footer'>
        <span class='todo-count'>
          <strong>{itemsLeft}</strong> {itemStr} left
        </span>
        <ul class='filters'>
          {
            Object.keys(filters).map(key =>
              <li><a href={filters[key]} class={{selected: isSelected(key, active)}}>{key}</a></li>
            )
          }
        </ul>
        <button class='clear-completed' onClick={clearCompleted} style={{display: completed ? 'block' : 'none'}}>
          Clear Completed
        </button>
      </footer>
    )
  }
})

/**
 * Helpers
 */

function isSelected (name, active) {
  return !active && name === 'All' || name.toLowerCase() === active
}
