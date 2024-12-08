const loginWith = async (page, username, password)  => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
  }

  const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByTestId('newBlogTitle').fill(title)
    await page.getByTestId('newBlogAuthor').fill(author)
    await page.getByTestId('newBlogUrl').fill(url)
    await page.getByRole('button', { name: 'save' }).click()
    const blogDiv = page.getByTestId('blogDiv')
    await blogDiv.getByRole('button', { name: 'view' }).click()
    await blogDiv.getByText(title).waitFor()
    await blogDiv.getByText(author).waitFor()
    await blogDiv.getByText(url).waitFor()
  }

  
  export { loginWith, createBlog }