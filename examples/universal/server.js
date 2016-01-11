/**
 * Imports
 */

import browserify from 'koa-browserify-middleware'
import vdux from '../../src/string'
import route from 'koa-route'
import boot from './main'
import koa from 'koa'

/**
 * Constants
 */

const app = koa()

/**
 * Render
 */

app.use(route.get('/index.js', browserify('./index.js', {transform: ['babelify']})))

app.use(function *() {
  const html = yield boot(vdux)
  this.body = `<html><head><script type='text/javascript' src='/index.js'></script></head><body>${html}</body></html>`
})

/**
 * Listen
 */

app.listen(3000)
