/**
 * Window component
 */

module.exports = require('./lib/global-listener').default(typeof window === 'undefined' ? {} : window)
