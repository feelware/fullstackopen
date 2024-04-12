import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const res = await axios.get(baseUrl)
  return res.data
}

const create = async data => {
  const res = await axios.post(baseUrl, data)
  return res.data
}

const update = async ({ id, update }) => {
  const res = await axios.patch(`${baseUrl}/${id}`, update)
  return res.data
}

export default {
  getAll,
  create,
  update
}