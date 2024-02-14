const mongoose = require('mongoose')
const supertest = require('supertest')
const api = supertest(require('../app'))
const testBlogs = require('./blogs_for_testing')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../utils/test_helper')

let testToken

describe('when fetching all blog posts from api', () => {
  test('correct amount of posts is returned', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(testBlogs.length)
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

    const newBlog = {
      title: 'Test blog',
      author: 'Test Author',
      url: 'http://test.url',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await helper.blogsInDb()
    expect(response).toHaveLength(blogsAtStart.length + 1)

    const titles = response.map(blog => blog.title)
    expect(titles).toContain('Test blog')
  }, 100000)

  test('401 is returned if token is missing', async () => {
    const newBlog = {
      title: 'Test blog',
      author: 'Test Author',
      url: 'http://test.url',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('likes property defaults to 0 when not specified', async () => {
    const blogNoLikes = {
      title: 'Test blog',
      author: 'Test Author',
      url: 'http://test.url'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send(blogNoLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)
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
      .send({
        title: 'Test blog',
        author: 'Test Author',
        url: 'http://test.url',
        likes: 0
      })

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
      .send({
        title: 'Test blog',
        author: 'Test Author',
        url: 'http://test.url',
        likes: 0
      })

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
      .send({
        title: 'Test blog',
        author: 'Test Author',
        url: 'http://test.url',
        likes: 0
      })

    blogToUpdate = blogToUpdate.body

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `bearer ${testToken}`)
      .send({
        likes: blogToUpdate.likes + 1
      })

    const updatedBlog = await api.get(`/api/blogs/${blogToUpdate.id}`)
    expect(updatedBlog.body.likes).toBe(blogToUpdate.likes + 1)
  }, 100000)

  test('401 is returned if token is missing', async () => {
    const blogToUpdate = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send({
        title: 'Test blog',
        author: 'Test Author',
        url: 'http://test.url',
        likes: 0
      })

    await api
      .put(`/api/blogs/${blogToUpdate.body.id}`)
      .send({
        likes: blogToUpdate.likes + 1
      })
      .expect(401)
  })

  test('404 is returned if post does not exist', async () => {
    await api
      .put('/api/blogs/65cbe5313494931419d312a7')
      .set('Authorization', `bearer ${testToken}`)
      .send({
        likes: 0
      })
      .expect(404)
  })

  test('400 is returned if id is invalid', async () => {
    await api
      .put('/api/blogs/invalid_id')
      .set('Authorization', `bearer ${testToken}`)
      .send({
        likes: 0
      })
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

  const blogPromises = testBlogs.map(testBlog => {
    const newBlog = new Blog(testBlog)
    return newBlog.save()
  })

  await Promise.all(blogPromises)
})

afterAll(async () => {
  await mongoose.connection.close()
})
