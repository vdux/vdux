/**
 * Imports
 */

import element from '../../element'
import reducer from './reducer'
import App from './app'

/**
 * App
 */

function boot (vdux, initialState, prerendered) {
  return vdux({
    reducer,
    initialState,
    app: state => <App {...state} />,
    prerendered
  })
}

/**
 * Exports
 */

export default boot
