/**
 * Imports
 */

import element from 'vdom-element'
import MainLayout from '../layouts/main'
import Nav from '../nav'

/**
 * Render
 */

function render () {
  return (
    <MainLayout nav={<Nav />}>
      <div>Hello World</div>
    </MainLayout>
  )
}

/**
 * Exports
 */

export default render
