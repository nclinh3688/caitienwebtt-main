import { POST } from '@/app/api/ai/openai/route'
import { NextRequest } from 'next/server'

// Mock OpenAI
jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: 'Test AI response'
                }
              }
            ]
          })
        }
      }
    }))
  }
})

describe('API Integration Tests', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_OPENAI_API_KEY = 'test-key'
  })

  describe('/api/ai/openai', () => {
    it('should handle valid AI requests', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: 'What is the meaning of こんにちは?',
          context: { pageType: 'vocabulary' },
          model: 'gpt-3.5-turbo'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.response).toBe('Test AI response')
      expect(data.success).toBe(true)
    })

    it('should handle missing API key', async () => {
      delete process.env.NEXT_PUBLIC_OPENAI_API_KEY

      const request = new NextRequest('http://localhost:3000/api/ai/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: 'Test question'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('OpenAI API key not configured')
    })

    it('should handle invalid JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json'
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it('should handle OpenAI API errors', async () => {
      const { default: OpenAI } = require('openai')
      const mockOpenAI = new OpenAI()
      mockOpenAI.chat.completions.create.mockRejectedValueOnce(
        new Error('OpenAI API error')
      )

      const request = new NextRequest('http://localhost:3000/api/ai/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: 'Test question'
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(500)
    })
  })

  describe('/api/ai/generate-test', () => {
    it('should generate test questions', async () => {
      // Mock the generate-test endpoint
      const { POST: generateTest } = await import('@/app/api/ai/generate-test/route')
      
      const request = new NextRequest('http://localhost:3000/api/ai/generate-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: 'N5',
          skill: 'vocabulary',
          numQuestions: 5
        })
      })

      const response = await generateTest(request)
      expect(response.status).toBe(200)
    })
  })

  describe('/api/courses', () => {
    it('should return course list', async () => {
      const { GET } = await import('@/app/api/courses/route')
      
      const request = new NextRequest('http://localhost:3000/api/courses')
      const response = await GET(request)
      
      expect(response.status).toBe(200)
    })
  })

  describe('/api/analytics/advanced', () => {
    it('should return analytics data', async () => {
      const { POST: analytics } = await import('@/app/api/analytics/advanced/route')
      
      const request = new NextRequest('http://localhost:3000/api/analytics/advanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'test-user',
          timeframe: 'month'
        })
      })

      const response = await analytics(request)
      expect(response.status).toBe(200)
    })
  })
})
