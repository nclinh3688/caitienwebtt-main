import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check if main elements are present
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('text=PHÚC KHIÊM Education AI')).toBeVisible()
  })

  test('should navigate to courses', async ({ page }) => {
    await page.goto('/')
    
    // Click on courses link
    await page.click('text=Courses')
    
    // Should navigate to courses page
    await expect(page).toHaveURL(/.*courses/)
  })

  test('should navigate to vocabulary', async ({ page }) => {
    await page.goto('/')
    
    // Click on vocabulary link
    await page.click('text=Vocabulary')
    
    // Should navigate to vocabulary page
    await expect(page).toHaveURL(/.*vocabulary/)
  })

  test('should navigate to grammar', async ({ page }) => {
    await page.goto('/')
    
    // Click on grammar link
    await page.click('text=Grammar')
    
    // Should navigate to grammar page
    await expect(page).toHaveURL(/.*grammar/)
  })

  test('should navigate to kanji', async ({ page }) => {
    await page.goto('/')
    
    // Click on kanji link
    await page.click('text=Kanji')
    
    // Should navigate to kanji page
    await expect(page).toHaveURL(/.*kanji/)
  })

  test('should navigate to listening', async ({ page }) => {
    await page.goto('/')
    
    // Click on listening link
    await page.click('text=Listening')
    
    // Should navigate to listening page
    await expect(page).toHaveURL(/.*listening/)
  })

  test('should navigate to dashboard', async ({ page }) => {
    await page.goto('/')
    
    // Click on dashboard link
    await page.click('text=Dashboard')
    
    // Should navigate to dashboard page
    await expect(page).toHaveURL(/.*dashboard/)
  })

  test('should navigate to profile', async ({ page }) => {
    await page.goto('/')
    
    // Click on profile link
    await page.click('text=Profile')
    
    // Should navigate to profile page
    await expect(page).toHaveURL(/.*profile/)
  })
})

test.describe('Mobile Navigation', () => {
  test('should show mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check if mobile menu button is visible
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible()
  })

  test('should toggle mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Click mobile menu button
    await page.click('[data-testid="mobile-menu-button"]')
    
    // Check if mobile menu is visible
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
  })
})
