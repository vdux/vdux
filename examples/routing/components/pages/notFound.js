/**
 * Imports
 */

import element from 'vdom-element'
import MainLayout from '../layouts/main'

/**
 * Render
 */

function render ({url}) {
  return (
    <MainLayout nav={<Nav />}>
      <div>
        <h2>Url '{url}' does not exist</h2>
      </div>
    </MainLayout>
  )
}

/**
 * Exports
 */

export default render
