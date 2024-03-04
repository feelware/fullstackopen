import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getBlog = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const create = async (blog) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const update = async (id, updateQuery) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.put(
    `${baseUrl}/${id}`,
    updateQuery,
    config
  )

  return response.body
}

const del = async (id) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(
    `${baseUrl}/${id}`,
    config
  )

  return response.body

}

export default { getAll, getBlog, create, update, del, setToken }
