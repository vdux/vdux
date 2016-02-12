/**
 * Document component
 */

module.exports = require('./lib/global-listener').default(typeof document === 'undefined' ? {} : document)
