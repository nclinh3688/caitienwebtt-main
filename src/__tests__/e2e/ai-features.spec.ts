import { test, expect } from '@playwright/test'

test.describe('AI Features', () => {
  test('should interact with AI Assistant', async ({ page }) => {
    await page.goto('/')
    
    // Find AI Assistant component
    const aiAssistant = page.locator('[data-testid="ai-assistant"]')
    await expect(aiAssistant).toBeVisible()
    
    // Type a question
    const input = aiAssistant.locator('input[placeholder*="ask"]')
    await input.fill('What is the meaning of こんにちは?')
    
    // Click send button
    await aiAssistant.locator('button[type="submit"]').click()
    
    // Wait for response
    await expect(aiAssistant.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 10000 })
  })

  test('should generate test questions', async ({ page }) => {
    await page.goto('/practice')
    
    // Find test generation form
    const testForm = page.locator('[data-testid="test-generator"]')
    await expect(testForm).toBeVisible()
    
    // Fill form
    await testForm.locator('select[name="level"]').selectOption('N5')
    await testForm.locator('select[name="skill"]').selectOption('vocabulary')
    await testForm.locator('input[name="numQuestions"]').fill('5')
    
    // Submit form
    await testForm.locator('button[type="submit"]').click()
    
    // Wait for generated questions
    await expect(testForm.locator('[data-testid="generated-questions"]')).toBeVisible({ timeout: 15000 })
  })

  test('should explain vocabulary with AI', async ({ page }) => {
    await page.goto('/vocabulary')
    
    // Find vocabulary item
    const vocabularyItem = page.locator('[data-testid="vocabulary-item"]').first()
    await expect(vocabularyItem).toBeVisible()
    
    // Click explain button
    await vocabularyItem.locator('button[data-testid="explain-button"]').click()
    
    // Wait for AI explanation
    await expect(page.locator('[data-testid="ai-explanation"]')).toBeVisible({ timeout: 10000 })
  })

  test('should analyze pronunciation', async ({ page }) => {
    await page.goto('/listening')
    
    // Find pronunciation analysis section
    const pronunciationSection = page.locator('[data-testid="pronunciation-analysis"]')
    await expect(pronunciationSection).toBeVisible()
    
    // Click record button
    await pronunciationSection.locator('button[data-testid="record-button"]').click()
    
    // Wait for recording to start
    await expect(pronunciationSection.locator('[data-testid="recording-indicator"]')).toBeVisible()
    
    // Stop recording after 3 seconds
    await page.waitForTimeout(3000)
    await pronunciationSection.locator('button[data-testid="stop-button"]').click()
    
    // Wait for analysis
    await expect(pronunciationSection.locator('[data-testid="pronunciation-feedback"]')).toBeVisible({ timeout: 15000 })
  })
})

test.describe('AI Error Handling', () => {
  test('should handle AI service errors gracefully', async ({ page }) => {
    // Mock AI service to return error
    await page.route('**/api/ai/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'AI service unavailable' })
      })
    })
    
    await page.goto('/')
    
    // Try to use AI Assistant
    const aiAssistant = page.locator('[data-testid="ai-assistant"]')
    const input = aiAssistant.locator('input[placeholder*="ask"]')
    await input.fill('Test question')
    await aiAssistant.locator('button[type="submit"]').click()
    
    // Should show error message
    await expect(page.locator('[data-testid="ai-error"]')).toBeVisible()
  })

  test('should show loading states', async ({ page }) => {
    // Mock AI service to be slow
    await page.route('**/api/ai/**', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ response: 'AI response' })
        })
      }, 2000)
    })
    
    await page.goto('/')
    
    // Use AI Assistant
    const aiAssistant = page.locator('[data-testid="ai-assistant"]')
    const input = aiAssistant.locator('input[placeholder*="ask"]')
    await input.fill('Test question')
    await aiAssistant.locator('button[type="submit"]').click()
    
    // Should show loading state
    await expect(page.locator('[data-testid="ai-loading"]')).toBeVisible()
  })
})
