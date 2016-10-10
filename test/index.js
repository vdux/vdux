/**
 * Imports
 */

import element from '../element'
import vdux from '../src/dom'
import test from 'tape'

/**
 * Tests
 */

test('should work', t => {
  const {render, subscribe} = vdux()

  render(<div>Hello world</div>, document.body)
  t.equal(document.body.innerHTML, '<div>Hello world</div>')
  t.end()
})
