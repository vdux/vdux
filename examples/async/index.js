/**
 * Imports
 */

import 'regenerator-runtime/runtime'
import fetch from 'redux-effects-fetch'
import logger from 'redux-logger'
import domready from '@f/domready'
import vdux from '../../src/dom'
import {element} from '../..'
import App from './app'

/**
 * Initialize
 */

const {subscribe, render} = vdux({
  middleware: [
    fetch,
    logger()
  ]
})

domready(() => {
  subscribe(state => {
    render(<App {...state} />)
  })
})
