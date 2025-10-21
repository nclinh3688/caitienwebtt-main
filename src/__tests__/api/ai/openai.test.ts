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

describe('/api/ai/openai', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_OPENAI_API_KEY = 'test-key'
  })

  it('returns AI response for valid request', async () => {
    const request = new NextRequest('http://localhost:3000/api/ai/openai', {
      method: 'POST',
      body: JSON.stringify({
        question: 'Test question',
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

  it('returns error for missing API key', async () => {
    delete process.env.NEXT_PUBLIC_OPENAI_API_KEY

    const request = new NextRequest('http://localhost:3000/api/ai/openai', {
      method: 'POST',
      body: JSON.stringify({
        question: 'Test question'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('OpenAI API key not configured')
  })

  it('returns error for invalid request body', async () => {
    const request = new NextRequest('http://localhost:3000/api/ai/openai', {
      method: 'POST',
      body: 'invalid json'
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})
