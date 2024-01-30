const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('connected!')
    })
    .catch((error) => {
        console.log('error connecting:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: v => {
                return /^\d{2}(-\d|\d-)\d{4}\d*/.test(v)
            },
            message: props => `${props.value} is not a valid phone number`
        }
    }
})
    
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)