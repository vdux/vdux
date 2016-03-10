/**
 * Imports
 */

import browserify from 'koa-browserify-middleware'
import element from '../../element'
import vdux from '../../src/string'
import reducer from './reducer'
import route from 'koa-route'
import App from './app'
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
  const initialState = {counter: this.request.query.counter || 0}
  const {render} = vdux({reducer, initialState})
  const html = render(<App {...initialState} />)

  this.body = `
    <html>
      <head>
        <script type='text/javascript'>window.__initialState__ = ${JSON.stringify(initialState)}</script>
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
