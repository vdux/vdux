/**
 * Imports
 */

import MainLayout from '../layouts/main'
import element from '../../../../element'

/**
 * Render
 */

function render ({props}) {
  const {url} = props

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
