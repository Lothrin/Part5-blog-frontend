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
      })
    
      test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'E2E Test Title', 'E2E Test Author', 'E2E Test Url')
      })
    })
  })
})