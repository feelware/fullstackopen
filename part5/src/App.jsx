import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notif from './components/Notif'
import blogService from './services/blogs'
import { login } from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState({})
  const [notif, setNotif] = useState({})

  /*
    username: mluukkai
    password: salainen
  */

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchBlogs()
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await login({ username, password })
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotif({
        type: 'error',
        msg: 'wrong credentials'
      })
      setTimeout(() => {
        setNotif({})
      }, 2500)
    }
  }

  if (!Object.keys(user).length) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              name='Username'
              type='text'
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              name='Password'
              type='password'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <p>{user.name} logged in</p>

      <Notif type={notif.type} msg={notif.msg} />

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
