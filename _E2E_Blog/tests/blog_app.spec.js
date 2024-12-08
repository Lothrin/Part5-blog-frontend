const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')


describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        id: '6755aab8fbd4cfb91648fad8',
        name: 'Erkam Arafat',
        username: 'root',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
      data: {
        id: '6755aab8fbd4cfb91648fad2',
        name: 'Mustafa Arafat',
        username: 'root2',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })
  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'root', 'salainen')
      await expect(page.getByText('Erkam Arafat logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'wrongname', 'wrongpassword')

    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('Wrong Credentials')
    await expect(page.getByText('Erkam Arafat')).not.toBeVisible()
    })
    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'root2', 'salainen')
        await createBlog(page, 'HC Test Title', 'HC Test Author', 'HC Test Url')
      })
    
      test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'E2E Test Title', 'E2E Test Author', 'E2E Test Url')
      })
      test('a new blog can be liked', async ({ page }) => {
        await createBlog(page, 'E2E Test Title', 'E2E Test Author', 'E2E Test Url')
        const blogDiv = page.getByTestId('blogDiv')
        await blogDiv.getByRole('button', { name: 'like' }).nth(0).click()
        await blogDiv.getByText('likes: 1')
      })
      test('only the user who created the blog can delete it', async ({page}) => {
        await page.getByRole('button', { name: 'Logout' }).click()
        await loginWith(page, 'root', 'salainen')
        await page.getByRole('button', { name: 'Delete Blog' }).click()
        const blogDiv = page.getByTestId('blogDiv')
        await expect(blogDiv.getByText('HC Test Title')).toBeVisible()
        await expect(blogDiv.getByText('HC Test Author')).toBeVisible()

        await page.getByRole('button', { name: 'Logout' }).click()
        await loginWith(page, 'root2', 'salainen')
        await expect(blogDiv.getByText('HC Test Title')).not.toBeVisible()
        await expect(blogDiv.getByText('HC Test Author')).not.toBeVisible()
        await expect(blogDiv.getByText('HC Test Url')).not.toBeVisible()


      })
      // test('only the user who created the blog can see delete button', async ({page}) => {
      //   await page.getByRole('button', { name: 'Logout' }).click()
      //   await loginWith(page, 'root', 'salainen')
      //   await expect(page.getByText('HC Test Title')).toBeVisible()
      //   await expect(page.getByText('Delete Blog')).not.toBeVisible()
      // })
    })
  })
})