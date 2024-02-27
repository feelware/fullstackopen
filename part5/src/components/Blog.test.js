import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('blog post component', () => {
  let container 

  const blog = {
    id: '0',
    title: 'test title',
    author: 'test author',
    url: 'https://www.google.com/',
    likes: [],
    user: {
      username: 'stevan',
      id: '0'
    }
  }

  const currUser = {
    id: '0',
    username: 'stevan',
    likes: []
  }

  const handleLike = jest.fn((liked, blog) => () => {
    console.log('liked: ', liked)
    console.log('blog: ', blog)
  })

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        liked={false}
        isowner={true}
        handleLike={handleLike}
        handleDel={() => {}}
      />
    ).container
  })

  test('by default renders title & author, but not url or likes', () => {
    const heading = container.querySelector('.heading')
    expect(heading).toHaveTextContent('test title test author')

    const details = container.querySelector('.details')
    expect(details).toBeNull()
  })

  describe('after clicking view button', () => {
    let user

    beforeEach(async () => {
      user = userEvent.setup()
  
      const viewButton = screen.getByRole('button')
      await user.click(viewButton)
    })

    test('url and likes are shown', async () => {
      const details = container.querySelector('.details')
      expect(details).toHaveTextContent('https://www.google.com/')
      expect(details).toHaveTextContent('likes 0')
    })

    test.only('when clicking like button twice, event handler is called twice', async () => {
      screen.debug()
      const likeButton = screen.getByText('like')
      await user.click(likeButton)
      await user.click(likeButton)
      expect(handleLike).toHaveBeenCalledTimes(2)
    })
  })
})

