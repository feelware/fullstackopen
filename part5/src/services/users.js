import axios from 'axios'
const baseUrl = '/api/users'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getUser = async id => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const update = async (id, update) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.put(
    `${baseUrl}/${id}`,
    update,
    config
  )

  return response.body
}

export default { setToken, getUser, update }
