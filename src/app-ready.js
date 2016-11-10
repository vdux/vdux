/**
 * Constants
 */

const APP_READY = 'VDUX_APP_READY'

/**
 * Application readiness middleware/action
 */

function appReady (data) {
  return {
    type: APP_READY,
    payload: data
  }
}

/**
 * Middleware
 */

function middleware (cb) {
  return ctx => next => action => action.type === APP_READY
    ? cb(action.payload)
    : next(action)
}

/**
 * Exports
 */

export default middleware
export {
  appReady
}
