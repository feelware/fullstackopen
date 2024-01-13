const PersonForm = (props) => (
    <form onSubmit={props.addPerson}>
        <div>
            name: <input value={props.nameVal} onChange={props.onNameChange} />
        </div>
        <div>
            number: <input value={props.numVal} onChange={props.onNumChange} />
        </div>
        <div>
            <button type="submit">add</button>
        </div>
    </form>
)

export default PersonForm