const Notification = ({ message, type }) => ( message &&
    <div className={type}>
        {message}
    </div>
)

export default Notification