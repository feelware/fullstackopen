const supertest = require('supertest')
const api = supertest(require('../app'))
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('../utils/test_helper')

describe('when there is initially one user in db', () => {
  let usersAtStart, ogUserId

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const initialUser = new User({ username: 'root', passwordHash })
    const response = await initialUser.save()
    ogUserId = response._id

    usersAtStart = await helper.usersInDb()
  })

  test('creation succeeds with a fresh username', async () => {
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const userRepeated = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(userRepeated)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails if username is less than 3 characters', async () => {
    const userShortUsername = {
      username: 'ro',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(userShortUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('is shorter than the minimum allowed length')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails if password is less than 3 characters', async () => {
    const userShortPassword = {
      username: 'root',
      name: 'Superuser',
      password: 'sa'
    }

    const result = await api
      .post('/api/users')
      .send(userShortPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('updating a user succeeds if the user is authorized', async () => {
    const credentials = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const token = credentials.body.token

    await api
      .put(`/api/users/${ogUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'superuser' })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const updatedUser = await User.findById(ogUserId)
    expect(updatedUser.username).toBe('superuser')
  })
})
