import { useEffect, useState } from 'react'
import service from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [notif, setNotif] = useState({})

    const handleNameChange = e => setNewName(e.target.value)
    const handleNumberChange = e => setNewNumber(e.target.value)
    const handleFilterChange = e => setFilter(e.target.value)
    
    const checkRepeated = per => persons.map(p => p.name.toLowerCase()).find(p => p === per.toLowerCase())
    
    useEffect(() => {
        service.getAll()
            .then(initPersons => {
                setPersons(initPersons)
            })
    }, [])

    const addPerson = (e) => {
        e.preventDefault()
        if (checkRepeated(newName)) {
            if (!confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                return
            }
            const person = persons.find(p => p.name === newName)
            const newPerson = {...person, number: newNumber}
            return service
                .update(newPerson)
                .then(returnedPerson => {
                    setPersons(persons.map(p => p.id === newPerson.id ? returnedPerson : p))
                    setNewName('')
                    setNewNumber('')
                    setNotif({
                        msg: `Added ${newPerson.name} to the phonebook`,
                        type: 'success'
                    })
                    setTimeout(() => {setNotif({})}, 5000)
                })
                .catch(error => {
                    if (error.response.data.type === 'ValidationError') {
                        setNotif({
                            msg: `${error.response.data.error}`,
                            type: 'error'
                        })
                        return setTimeout(() => {setNotif({})}, 5000)
                    }
                    setPersons(persons.filter(p => p.id !== newPerson.id))
                    setNotif({
                        msg: `${newPerson.name} was already deleted from the phonebook`,
                        type: 'error'
                    })
                    setTimeout(() => {setNotif({})}, 5000)
                })
        }

        const newPerson = {
            name: newName,
            number: newNumber
        }

        service
            .create(newPerson)
            .then(returnedPerson => {
                setPersons(persons.concat(returnedPerson))
                setNewName('')
                setNewNumber('')
                setNotif({
                    msg: `Added ${newPerson.name} to the phonebook`,
                    type: 'success'
                })
                setTimeout(() => {setNotif({})}, 5000)
            })
            .catch(error => {
                setNotif({
                    msg: `${error.response.data.error}`,
                    type: 'error'
                })
            })
    }

    const delPerson = (id, name) => {
        if (!window.confirm(`delete ${name}?`)) {
            return
        }
        service
            .del(id)
            .then(setPersons(persons.filter(p => p.id !== id)))
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={notif.msg} type={notif.type} /> 
            <Filter value={filter} onChange={handleFilterChange} />

            <h2>add a new</h2>
            <PersonForm 
                onSubmit={addPerson}
                nameVal={newName}
                onNameChange={handleNameChange}
                numVal={newNumber}
                onNumChange={handleNumberChange}
            />

            <h2>Numbers</h2>
            <Persons persons={persons} filter={filter} handleDel={delPerson} />
        </div>
    )
}

export default App