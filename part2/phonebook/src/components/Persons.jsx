const Persons = ({ persons, filter, handleDel }) => {
    return (
        <div>
            {
                persons
                .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
                .map(p => (
                    <div key={p.name}>
                        {p.name} {p.number}
                        <button onClick={() => handleDel(p.id, p.name)}>
                            delete
                        </button>
                    </div>
                ))
            }
        </div>
    )
}

export default Persons