import { createContext, useContext, useReducer } from 'react'
import PropTypes from 'prop-types';

const notifReducer = (state, action) => {
  switch (action.type) {
    case "CREATE":
      return action.payload
    case "RESET":
      return ''
    default:
      return state
  }
}

const contextObject = createContext()

export const ContextProvider = (props) => {
  const [notifValue, notifDispatch] = useReducer(notifReducer, '')

  return (
    <contextObject.Provider value={[notifValue, notifDispatch]}>
      {props.children}  
    </contextObject.Provider>
  )
}

export const useNotifValue = () => {
  const valueAndDispatch = useContext(contextObject)
  return valueAndDispatch[0]
}

export const useNotifDispatch = () => {
  const valueAndDispatch = useContext(contextObject)
  return valueAndDispatch[1]
}

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default contextObject