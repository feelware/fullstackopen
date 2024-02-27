/// <reference types="Cypress" />

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.get('input[name="username"]')
    cy.get('input[name="password"]')
    cy.get('button').contains('login')
  })

  describe('Login', function() {
    beforeEach(function() {
      const newUser = {
        username: 'feelware',
        password: '123'
      }
      cy.request('POST', 'http://localhost:3003/api/users', newUser)
    })

    it('succeeds with correct credentials', function() {
      cy.get('input[name="username"]')
        .type('feelware')

      cy.get('input[name="password"]')
        .type('123')

      cy.get('button[type="submit"]').click()

      cy.contains('feelware logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('input[name="username"]')
        .type('user')

      cy.get('input[name="password"]')
        .type('password')

      cy.get('button[type="submit"]').click()

      cy.contains('wrong username or password')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      const newUser = {
        username: 'feelware',
        password: '123'
      }

      cy.request('POST', 'http://localhost:3003/api/users', newUser)

      cy.get('input[name="username"]')
        .type('feelware')

      cy.get('input[name="password"]')
        .type('123')

      cy.get('button[type="submit"]').click()
    })

    it('a blog can be created', function() {
      cy.get('button').contains('submit').click()
  
      cy.get('input[name="title"]')
        .type('test title')
  
      cy.get('input[name="author"]')
        .type('test author')
  
      cy.get('input[name="url"]')
        .type('https://www.google.com/')
  
      cy.get('button').contains('create').click()
  
      cy.contains('test title test author')
    })

    describe('after a blog has been created', function() {
      beforeEach(function() {
        createBlog({
          title: 'test title',
          author: 'test author',
          url: 'https://www.google.com/'
        })
        cy.get('button').contains('view').click()
      })

      it('users can like it', function() {
        cy.get('button').contains('like').click()
        cy.contains('likes 1')
      })

      it('user who created can delete it', function() {
        cy.get('button').contains('remove').click()
        cy.get('div[class="blogs"]').children().should('not.exist')
      })

      it('only creator can see its delete button', function() {
        // creator can see button
        cy.get('button').contains('remove')

        switchUser({
          username: 'otheruser',
          password: '123'
        })
        
        // other user shouldn't see button
        cy.get('button').contains('view').click()
        cy.get('button').contains('delete').should('not.exist')
      })
    })

    it('blogs are sorted by likes (max first)', function() {
      createBlog({
        title: 'post with 0 likes',
        author: 'test author',
        url: 'https://www.google.com/'
      })

      createBlog({
        title: 'post with 1 like',
        author: 'test author',
        url: 'https://www.google.com/'
      })

      cy.get('button[class="viewBlog"]').eq(1).click()
      cy.get('button').contains('like').click()

      cy.get('.blog').eq(0).should('contain', 'post with 1 like')
      cy.get('.blog').eq(1).should('contain', 'post with 0 likes')
    })
  })
})

const createBlog = function({ title, author, url }) {
  cy.get('button').contains('submit').click()

  cy.get('input[name="title"]')
    .type(title)

  cy.get('input[name="author"]')
    .type(author)

  cy.get('input[name="url"]')
    .type(url)

  cy.get('button').contains('create').click()
}

const switchUser = function({ username, password }) {
  cy.get('button').contains('logout').click()

  const newUser = {
    username: username,
    password: password
  }

  cy.request('POST', 'http://localhost:3003/api/users', newUser)

  cy.get('input[name="username"]')
  .type(username)

  cy.get('input[name="password"]')
    .type(password)

  cy.get('button[type="submit"]').click()
} 