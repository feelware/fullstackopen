import axios from 'axios'
const baseUrl = 'https://phonebook-backend-39ej.onrender.com/api/persons'

const getAll = () => axios
    .get(baseUrl)
    .then(r => r.data)

const create = newObj => axios
    .post(baseUrl, newObj)
    .then(r => r.data)

const update = (newObj) => axios
    .put(`${baseUrl}/${newObj.id}`, newObj)
    .then(r => r.data)

const del = (id) => axios.delete(`${baseUrl}/${id}`)

export default { getAll, create, update, del }