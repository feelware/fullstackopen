import { useEffect, useState } from 'react'
import pService from './services/persons'
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
        pService.getAll()
            .then(initPersons => {
                setPersons(initPersons)
            })
    }, [])

    const addPerson = (e) => {
        e.preventDefault()
        if (checkRepeated(newName)) {
            if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                const person = persons.find(p => p.name === newName)
                const newPerson = {...person, number: newNumber}
                pService
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
                    .catch(() => {
                        setPersons(persons.filter(p => p.id !== newPerson.id))
                        setNotif({
                            msg: `${newPerson.name} was already deleted from the phonebook`,
                            type: 'error'
                        })
                        setTimeout(() => {setNotif({})}, 5000)
                    })
            }
        }
        else {
            const newPerson = {
                name: newName,
                number: newNumber
            }
            pService
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
        }
    }

    const delPerson = (id, name) => {
        if (window.confirm(`delete ${name}?`)) {
            pService.del(id)
            .then(setPersons(persons.filter(p => p.id !== id)))
        }
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