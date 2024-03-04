import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef(({ buttonLabel, children }, refs) => {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => setVisible(!visible)

  useImperativeHandle(refs, () => {
    return { toggleVisible }
  })

  return (
    <div>
      {visible && children}
      <button onClick={toggleVisible}>
        {visible ? 'cancel' : buttonLabel}
      </button>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable
