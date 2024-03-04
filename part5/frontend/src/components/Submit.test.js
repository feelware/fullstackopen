import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Submit from './Submit'

describe('new blog form', () => {
  const submitBlog = jest.fn()
  const user = userEvent.setup()
  let container

  beforeEach(() => {
    container = render(
      <Submit 
        submitBlog={submitBlog}
      />
    ).container
  })

  test('when submitting, event handler is called with right details', async () => {
    const titleInput = screen.getByPlaceholderText('Enter the title of the post')
    const authorInput = screen.getByPlaceholderText('Enter the author')
    const urlInput = screen.getByPlaceholderText('Enter the url')
    const createButton = screen.queryByRole('button')

    await user.type(titleInput, 'test title')
    await user.type(authorInput, 'test author')
    await user.type(urlInput, 'https://www.google.com/')
    await user.click(createButton)

    expect(submitBlog).toHaveBeenCalled()

    const details = submitBlog.mock.calls[0][0]

    expect(details).toEqual({
      title: 'test title',
      author: 'test author',
      url: 'https://www.google.com/'
    })
  })
})