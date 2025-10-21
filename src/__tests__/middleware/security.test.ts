import { NextRequest } from 'next/server'
import { rateLimit, securityHeaders, validateApiKey, sanitizeInput } from '@/middleware/security'

describe('Security Middleware', () => {
  describe('Rate Limiting', () => {
    it('should allow requests within limit', () => {
      const req = new NextRequest('http://localhost:3000/api/test', {
        headers: { 'x-forwarded-for': '192.168.1.1' }
      })
      
      const response = rateLimit(100, 15 * 60 * 1000)(req)
      
      expect(response.status).toBe(200)
    })

    it('should block requests exceeding limit', () => {
      const req = new NextRequest('http://localhost:3000/api/test', {
        headers: { 'x-forwarded-for': '192.168.1.1' }
      })
      
      // Simulate multiple requests
      for (let i = 0; i < 101; i++) {
        rateLimit(100, 15 * 60 * 1000)(req)
      }
      
      const response = rateLimit(100, 15 * 60 * 1000)(req)
      
      expect(response.status).toBe(429)
    })
  })

  describe('Security Headers', () => {
    it('should add security headers', () => {
      const req = new NextRequest('http://localhost:3000/test')
      const response = securityHeaders(req)
      
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
      expect(response.headers.get('X-Frame-Options')).toBe('DENY')
      expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block')
      expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
    })

    it('should add CORS headers', () => {
      const req = new NextRequest('http://localhost:3000/test')
      const response = securityHeaders(req)
      
      expect(response.headers.get('Access-Control-Allow-Origin')).toBeDefined()
      expect(response.headers.get('Access-Control-Allow-Methods')).toBeDefined()
      expect(response.headers.get('Access-Control-Allow-Headers')).toBeDefined()
    })
  })

  describe('API Key Validation', () => {
    it('should allow requests with valid API key', () => {
      process.env.API_KEY = 'test-key'
      
      const req = new NextRequest('http://localhost:3000/api/test', {
        headers: { 'x-api-key': 'test-key' }
      })
      
      const response = validateApiKey(req)
      
      expect(response.status).toBe(200)
    })

    it('should reject requests with invalid API key', () => {
      process.env.API_KEY = 'test-key'
      
      const req = new NextRequest('http://localhost:3000/api/test', {
        headers: { 'x-api-key': 'wrong-key' }
      })
      
      const response = validateApiKey(req)
      
      expect(response.status).toBe(401)
    })

    it('should allow requests when no API key is configured', () => {
      delete process.env.API_KEY
      
      const req = new NextRequest('http://localhost:3000/api/test')
      const response = validateApiKey(req)
      
      expect(response.status).toBe(200)
    })
  })

  describe('Input Sanitization', () => {
    it('should sanitize script tags', () => {
      const input = '<script>alert("xss")</script>Hello'
      const sanitized = sanitizeInput(input)
      
      expect(sanitized).toBe('Hello')
    })

    it('should sanitize javascript: URLs', () => {
      const input = 'javascript:alert("xss")'
      const sanitized = sanitizeInput(input)
      
      expect(sanitized).toBe('')
    })

    it('should sanitize event handlers', () => {
      const input = '<img onerror="alert(\'xss\')" src="test.jpg">'
      const sanitized = sanitizeInput(input)
      
      expect(sanitized).toBe('<img src="test.jpg">')
    })

    it('should handle arrays', () => {
      const input = ['<script>alert("xss")</script>', 'normal text']
      const sanitized = sanitizeInput(input)
      
      expect(sanitized).toEqual(['', 'normal text'])
    })

    it('should handle objects', () => {
      const input = {
        name: '<script>alert("xss")</script>',
        description: 'normal text'
      }
      const sanitized = sanitizeInput(input)
      
      expect(sanitized).toEqual({
        name: '',
        description: 'normal text'
      })
    })

    it('should handle nested objects', () => {
      const input = {
        user: {
          name: '<script>alert("xss")</script>',
          bio: 'normal text'
        },
        tags: ['<script>alert("xss")</script>', 'normal']
      }
      const sanitized = sanitizeInput(input)
      
      expect(sanitized).toEqual({
        user: {
          name: '',
          bio: 'normal text'
        },
        tags: ['', 'normal']
      })
    })
  })
})
