const mongoose = require('mongoose')
const supertest = require('supertest')
const api = supertest(require('../app'))
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../utils/test_helper')
const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/'
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
  }
]
const newBlog = {
  title: 'Test blog',
  author: 'Test Author',
  url: 'http://test.url'
}

let testToken

describe('when fetching all blog posts from api', () => {
  test('correct amount of posts is returned', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(initialBlogs.length)
  }, 100000)

  test('all posts have an id property', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    blogs.body.forEach(blog => expect(blog.id).toBeDefined())
  }, 100000)
})

describe('when sending a new blog post to api', () => {
  test('it is saved correctly if correctly formatted', async () => {
    const blogsAtStart = await helper.blogsInDb()

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain('Test blog')
  }, 100000)

  test('401 is returned if token is missing', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('likes property defaults to empty array when not specified', async () => {
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toEqual([])
  })

  test('400 is returned if title or url is missing', async () => {
    const blogNoTitle = {
      author: 'Test Author',
      url: 'http://test.url'
    }

    const blogNoUrl = {
      title: 'Test blog',
      author: 'Test Author'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send(blogNoTitle)
      .expect(400)

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send(blogNoUrl)
      .expect(400)
  })
})

describe('when deleting a blog post from api', () => {
  test('it is removed correctly if it exists', async () => {
    const blogToDelete = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send(newBlog)

    const blogsAtStart = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${blogToDelete.body.id}`)
      .set('Authorization', `bearer ${testToken}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  }, 100000)

  test('401 is returned if token is missing', async () => {
    const blogToDelete = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send(newBlog)

    await api
      .delete(`/api/blogs/${blogToDelete.body.id}`)
      .expect(401)
  })

  test('404 is returned if post does not exist', async () => {
    await api
      .delete('/api/blogs/65cbe5313494931419d312a7')
      .set('Authorization', `bearer ${testToken}`)
      .expect(404)
  })

  test('400 is returned if id is invalid', async () => {
    await api
      .delete('/api/blogs/abcd')
      .set('Authorization', `bearer ${testToken}`)
      .expect(400)
  })
})

describe('when updating a blog post from api', () => {
  test('it is updated correctly if it exists', async () => {
    let blogToUpdate = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send(newBlog)

    blogToUpdate = blogToUpdate.body

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `bearer ${testToken}`)
      .send({ url: 'http://example.com' })

    const updatedBlog = await api.get(`/api/blogs/${blogToUpdate.id}`)
    expect(updatedBlog.body.url).toBe('http://example.com')
  }, 100000)

  test('401 is returned if token is missing', async () => {
    const blogToUpdate = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send({ url: 'http://othertest.url' })

    await api
      .put(`/api/blogs/${blogToUpdate.body.id}`)
      .send({ url: 'http://example.com' })
      .expect(401)
  })

  test('404 is returned if post does not exist', async () => {
    await api
      .put('/api/blogs/65cbe5313494931419d312a7')
      .set('Authorization', `bearer ${testToken}`)
      .send({ url: 'http://othertest.url' })
      .expect(404)
  })

  test('400 is returned if id is invalid', async () => {
    await api
      .put('/api/blogs/invalid_id')
      .set('Authorization', `bearer ${testToken}`)
      .send({ url: 'http://othertest.url' })
      .expect(400)
  })
})

beforeEach(async () => {
  await User.deleteMany({})

  await api
    .post('/api/users')
    .send({
      username: 'testuser',
      password: 'testpassword'
    })

  const login = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'testpassword'
    })

  testToken = login.body.token

  await Blog.deleteMany({})

  const blogPromises = initialBlogs.map(testBlog => {
    const newBlog = new Blog(testBlog)
    return newBlog.save()
  })

  await Promise.all(blogPromises)
})

afterAll(async () => {
  await mongoose.connection.close()
})
