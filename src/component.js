/**
 * Imports
 */

import applyMiddleware from 'redux/lib/applyMiddleware'
import {t} from 'virtex-component'
import has from '@f/has'

/**
 * Component factory
 */

function component (data) {
  if (typeof data === 'function') data = {name: data.name, render: data}

  const {controller, reducer, actions, middleware, initialState = {}} = data

  return {
    ...data,
    propTypes: typeof data.propTypes === 'object' ? t.struct(data.propTypes) : data.propTypes,
    stateTypes: data.stateTypes && t.struct(data.stateTypes),
    middleware: createMiddleware(middleware),
    initialState: typeof initialState === 'function'
      ? initialState
      : () => initialState,
    actions: createActions(actions, controller, reducer),
    controller: createController(controller),
    reducer: createReducer(reducer)
  }
}

/**
 * Utilities
 */

function createMiddleware (mw) {
  if (Array.isArray(mw)) return mw
  else if (typeof mw === 'object') {
    if (typeof window !== 'undefined') return [].concat(mw.browser, mw.shared).filter(Boolean)
    else return [].concat(mw.node, mw.shared).filter(Boolean)
  }

  return mw
}

function createController (fx) {
  if (!fx || typeof fx === 'function') return fx

  return ctx => next => action => fx[action.type]
    ? ctx.dispatch(fx[action.type](ctx.getThunk(), ...action.payload))
    : next(action)
}

function createActions (actions, controller, reducer) {
  const list = []

  if (actions) list.push.apply(list, actions)
  if (controller) list.push.apply(list, Object.keys(controller))
  if (reducer) list.push.apply(list, Object.keys(reducer))

  if (!list.length) return

  return list
}

function createReducer (reducer) {
  if (!reducer || typeof reducer === 'function') return reducer

  return (state, action) => {
    if (state && has(action.type, reducer)) {
      const result = reducer[action.type](state, ...action.payload)

      if (result) {
        return {...state, ...result}
      }
    }

    return state
  }
}

/**
 * Exports
 */

export default component
