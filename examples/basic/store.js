/**
 * Imports
 */

import {createStore, applyMiddleware} from 'redux'
import dom from 'virtex-dom'
import reducer from './reducer'

/**
 * Store
 */

const createStoreWithMiddleware = applyMiddleware(dom(document))(createStore)
const store = createStoreWithMiddleware(reducer, {counter: 0})

/**
 * Exports
 */

export default store
