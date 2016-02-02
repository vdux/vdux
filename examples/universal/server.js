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
  const {html, vtree, state} = yield boot(vdux, {counter: this.request.query.counter || 0})

  this.body = `
    <html>
      <head>
        <script type='text/javascript'>window.__initialState__ = ${JSON.stringify(state)}</script>
        <script type='text/javascript' src='/index.js'></script>
      </head>
      <body>${html}</body>
    </html>`
})

/**
 * Listen
 */

app.listen(3000, function () {
  console.log('Listening', 3000)
})
