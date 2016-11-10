/**
 * Imports
 */

import globalListener from './global-listener'
import element from 'virtex-element'
import {appReady} from './app-ready'
import component from './component'
import getValue from '@f/get-value'
import {findDOMNode} from 'virtex'

/**
 * Global pseudo-components to listen on
 */

const Window = globalListener(typeof window === 'undefined' ? {} : window)
const Body = globalListener(() => document.body)
const Document = globalListener(typeof document === 'undefined' ? {} : document)

/**
 * Decoders for event handling
 */

const decoder = decoder => handler => ({handler, decoder})
const decodeRaw = decoder(e => e)
const decodeNode = decoder(e => e.target)
const decodeValue = decoder(e => getValue(e.target))
const decodeFiles = decoder(e => e._rawEvent.target.files)
const decodeMouse = decoder(({clientX, clientY}) => ({clientX, clientY}))

/**
 * Default useful event handlers
 */

const stopPropagation = {stopPropagation: true}
const preventDefault = {preventDefault: true}

/**
 * Exports
 */

export {
  component,
  element,
  Document,
  Window,
  Body,
  appReady,
  findDOMNode,

  decoder,
  decodeRaw,
  decodeNode,
  decodeValue,
  decodeFiles,
  decodeMouse,

  stopPropagation,
  preventDefault
}
