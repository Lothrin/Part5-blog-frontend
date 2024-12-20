const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')


describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Erkam Arafat',
        username: 'root',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
      data: {
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
        await loginWith(page, 'root', 'salainen')
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
        page.reload() //the user data that is passed to the blog in the backend has to be updated in FE
        const blogDiv = page.getByTestId('blogDiv')
        await blogDiv.getByRole('button', { name: 'Delete Blog' }).click()
        await expect(blogDiv.getByText('HC Test Title')).not.toBeVisible()
        await expect(blogDiv.getByText('HC Test Author')).not.toBeVisible()
        await expect(blogDiv.getByText('HC Test Url')).not.toBeVisible()
      })
      test('only the user who created the blog can see delete button', async ({page}) => {
        page.reload() //the user data that is passed to the blog in the backend has to be updated in FE
        const blogDiv = page.getByTestId('blogDiv')
        await expect(blogDiv.getByText('HC Test Title')).toBeVisible()
        await expect(blogDiv.getByText('Delete Blog')).toBeVisible()
        await page.getByRole('button', { name: 'Logout' }).click()
        await loginWith(page, 'root2', 'salainen')
        await expect(blogDiv.getByText('HC Test Title')).toBeVisible()
        await expect(blogDiv.getByText('Delete Blog')).not.toBeVisible()
      })

      test('blogs are ordered by likes, most liked first', async ({ page }) => {
        page.reload() //the user data that is passed to the blog in the backend has to be updated in FE
        const blogDiv = page.getByTestId('blogDiv')
        await blogDiv.getByRole('button', { name: 'Delete Blog' }).click()

        await createBlog(page, 'Blog 1', 'Author 1', 'http://test1.com');
        await createBlog(page, 'Blog 2', 'Author 2', 'http://test2.com');
        await createBlog(page, 'Blog 3', 'Author 3', 'http://test3.com');

        await blogDiv.getByRole('button', { name: 'like' }).nth(2).click()
        await blogDiv.getByRole('button', { name: 'like' }).nth(1).click()
        await blogDiv.getByRole('button', { name: 'like' }).nth(2).click()
        await page.waitForTimeout(3000);

        await expect(blogDiv.nth(0).getByText('Blog 3')).toBeVisible()
        await expect(blogDiv.nth(0).getByText('Author 3')).toBeVisible()
        await expect(blogDiv.nth(0).getByText('http://test3.com')).toBeVisible()
        await expect(blogDiv.nth(0).getByText('likes: 2')).toBeVisible()

        await expect(blogDiv.nth(1).getByText('Blog 2')).toBeVisible()
        await expect(blogDiv.nth(1).getByText('Author 2')).toBeVisible()
        await expect(blogDiv.nth(1).getByText('http://test2.com')).toBeVisible()
        await expect(blogDiv.nth(1).getByText('likes: 1')).toBeVisible()
      });      
    })
  })
})