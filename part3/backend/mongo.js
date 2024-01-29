const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://stevan:${password}@cluster0.cxplogu.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url).catch(error => console.log(error))

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

switch (process.argv.length) {
case 3:
    {
        Person
            .find({})
            .then(persons => {
                console.log('phonebook:')
                persons.forEach(person => {
                    console.log(`${person.name} ${person.number}`)
                })
                mongoose.connection.close()
            })
    }
    break
case 5:
    {
        const name = process.argv[3]
        const number = process.argv[4]
        
        const person = new Person({
            name: name,
            number: number,
        })
        
        person.save().then(() => {
            console.log(`added ${name} number ${number} to phonebook`)
            mongoose.connection.close()
        })
    }
    break
default:
    break
}

