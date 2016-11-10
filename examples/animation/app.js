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
      <Button onClick={'INCREMENT'}>Counter: {state.counter}</Button>
    </div>
  )
}

/**
 * Exports
 */

export default app
