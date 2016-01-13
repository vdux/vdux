/**
 * Imports
 */

import element from '../../element'
import Button from './button'

/**
 * App
 */

function app (state) {
  return (
    <div>
      <Button onClick={increment}>Counter: {state.counter}</Button>
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
