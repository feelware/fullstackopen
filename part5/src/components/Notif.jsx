const Notif = ({ msg, type }) => (msg &&
    <div className={type}>
        {msg}
    </div>
)

export default Notif
