const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const api = supertest(require('../app'))
const User = require('../models/user')

describe('when there is initially one user in db', () => {
  test('login succeeds with correct credentials', async () => {
    const user = {
      username: 'testuser',
      password: 'testpassword'
    }

    const result = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body.token).toBeDefined()

    const decodedToken = jwt.verify(result.body.token, process.env.SECRET)
    expect(decodedToken.username).toBe(user.username)
  })
})

beforeEach(async () => {
  await User.deleteMany({})

  const user = {
    username: 'testuser',
    name: 'Test User',
    password: 'testpassword'
  }

  await api
    .post('/api/users')
    .send(user)
    .expect(201)
})
