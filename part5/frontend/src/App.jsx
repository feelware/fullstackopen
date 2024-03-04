import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notif from './components/Notif'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import Submit from './components/Submit'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notif, setNotif] = useState({})

  const submitFormRef = useRef()

  const notificate = info => {
    setNotif(info)
    setTimeout(() => {
      setNotif({})
    }, 2500)
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs.sort((a, b) => b.likes.length - a.likes.length))
    }
    fetchBlogs()
  }, [user])

  useEffect(() => {
    const retrieveUser = async () => {
      const loggedUserJSON = window.localStorage.getItem('loggedUser')
      if (loggedUserJSON) {
        let loggedUser = JSON.parse(loggedUserJSON)
        blogService.setToken(loggedUser.token)
        userService.setToken(loggedUser.token)
        loggedUser = await userService.getUser(loggedUser.id)
        setUser(loggedUser)
      }
    }
    retrieveUser()
  }, [])

  const login = async ({ username, password }) => {
    try {
      const loggedUser = await loginService.login({ username, password })
      blogService.setToken(loggedUser.token)
      userService.setToken(loggedUser.token)
      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser))
      const userToSet = await userService.getUser(loggedUser.id)
      setUser(userToSet)
      notificate({
        type: 'success',
        msg: 'logged in successfully'
      })
    } catch (exception) {
      notificate({
        type: 'error',
        msg: 'wrong username or password'
      })
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const submitBlog = async ({ title, author, url }) => {
    try {
      let newBlog = await blogService.create({
        title, author, url
      })
      newBlog = await blogService.getBlog(newBlog.id)
      setBlogs(blogs.concat(newBlog))
      submitFormRef.current.toggleVisible()
      notificate({
        type: 'success',
        msg: `a new blog ${title} by ${author} added`
      })
    } catch (exception) {
      notificate({
        type: 'error',
        msg: 'wrong blog post format'
      })
    }
  }

  const handleLike = (liked, blog) => {
    const newLikes = liked
      ? blog.likes.filter(likingUser => likingUser !== user.id)
      : blog.likes.concat(user.id)

    blogService.update(blog.id, { likes: newLikes })

    const newBlogs = [...blogs]
    const blogIndex = newBlogs.findIndex(b => b.id === blog.id)
    newBlogs[blogIndex].likes = newLikes
    setBlogs(newBlogs.sort((a, b) => b.likes.length - a.likes.length))
  }

  const handleDel = (id) => () => {
    blogService.del(id)
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  if (!user) {
    return (
      <div>
        <h2>Log in to the application</h2>
        <Notif type={notif.type} msg={notif.msg} />
        <Login login={login} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notif type={notif.type} msg={notif.msg} />

      <p>
        {user.name || user.username} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel='submit' ref={submitFormRef}>
        <Submit submitBlog={submitBlog} />
      </Togglable>

      <div className='blogs'>
        {blogs.map(blog =>
          <Blog
            key={blog.id} 
            blog={blog}
            liked={blog.likes.includes(user.id)}
            isowner={blog.user.id === user.id}
            handleLike={handleLike} 
            handleDel={handleDel}
          />
        )}
      </div>
    </div>
  )
}

export default App