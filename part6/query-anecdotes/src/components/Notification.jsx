import { useNotifValue } from "../NotifContext"

const Notification = () => {
  const notifValue = useNotifValue()

  if (!notifValue) return null

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={style}>
      {notifValue}
    </div>
  )
}

export default Notification
