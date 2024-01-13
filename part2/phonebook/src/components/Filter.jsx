const Filter = ({value, handler}) => (
    <div>
        filter shown with <input value={value} onChange={handler}/>
    </div>
)

export default Filter