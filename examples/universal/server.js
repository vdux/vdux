/**
 * Imports
 */

import browserify from 'koa-browserify-middleware'
import vdux from '../../src/string'
import route from 'koa-route'
import {element} from '../..'
import App from './app'
import koa from 'koa'

/**
 * Constants
 */

const app = koa()

/**
 * Render
 */

app.use(route.get('/index.js', browserify('./index.js', {transform: ['babelify'], debug: false})))

app.use(function *() {
  if (this.path !== '/') {
    this.body = ''
    return
  }

  const {subscribe, render} = vdux()
  const {html, state} = yield generate(this.request.query.counter)

  this.body = `
    <html>
      <head>
        <script type='text/javascript'>window.__initialState__ = ${JSON.stringify(state)}</script>
        <script type='text/javascript' src='/index.js'></script>
      </head>
      <body>${html}</body>
    </html>`
})


function generate (initialValue = 0) {
  let iterations = 0

  return new Promise((resolve, reject) => {
    const {subscribe, render} = vdux()

    const stop = subscribe(state => {
      try {
        const html = render(<App initialValue={Number(initialValue)} />)

        iterations++
        if (iterations === 2) {
          stop()
          resolve({html, state})
        }
      } catch (err) {
        stop()
        reject(err)
        console.log('caught err', err.stack)
      }
    })
  })
}

/**
 * Listen
 */

app.listen(3000, function () {
  console.log('Listening', 3000)
})
