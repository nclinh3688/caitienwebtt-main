import { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  AuthorizationError, 
  NotFoundError, 
  RateLimitError,
  createErrorResponse,
  withErrorHandler
} from '@/lib/error-handler'

describe('Error Handler', () => {
  describe('Custom Errors', () => {
    it('should create AppError with correct properties', () => {
      const error = new AppError('Test error', 400)
      
      expect(error.message).toBe('Test error')
      expect(error.statusCode).toBe(400)
      expect(error.isOperational).toBe(true)
    })

    it('should create ValidationError with 400 status', () => {
      const error = new ValidationError('Invalid input')
      
      expect(error.message).toBe('Invalid input')
      expect(error.statusCode).toBe(400)
    })

    it('should create AuthenticationError with 401 status', () => {
      const error = new AuthenticationError()
      
      expect(error.message).toBe('Authentication required')
      expect(error.statusCode).toBe(401)
    })

    it('should create AuthorizationError with 403 status', () => {
      const error = new AuthorizationError()
      
      expect(error.message).toBe('Insufficient permissions')
      expect(error.statusCode).toBe(403)
    })

    it('should create NotFoundError with 404 status', () => {
      const error = new NotFoundError()
      
      expect(error.message).toBe('Resource not found')
      expect(error.statusCode).toBe(404)
    })

    it('should create RateLimitError with 429 status', () => {
      const error = new RateLimitError()
      
      expect(error.message).toBe('Too many requests')
      expect(error.statusCode).toBe(429)
    })
  })

  describe('Error Response', () => {
    it('should create error response for AppError', () => {
      const error = new AppError('Test error', 400)
      const response = createErrorResponse(error, 400)
      
      expect(response.error.message).toBe('Test error')
      expect(response.statusCode).toBe(400)
      expect(response.error.timestamp).toBeDefined()
    })

    it('should include stack trace in development', () => {
      process.env.NODE_ENV = 'development'
      const error = new Error('Test error')
      const response = createErrorResponse(error)
      
      expect(response.error.stack).toBeDefined()
    })

    it('should not include stack trace in production', () => {
      process.env.NODE_ENV = 'production'
      const error = new Error('Test error')
      const response = createErrorResponse(error)
      
      expect(response.error.stack).toBeUndefined()
    })
  })

  describe('Error Handler Wrapper', () => {
    it('should handle successful operations', async () => {
      const mockHandler = jest.fn().mockResolvedValue({ success: true })
      const wrappedHandler = withErrorHandler(mockHandler)
      
      const req = { url: '/test', method: 'GET' }
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
      
      await wrappedHandler(req, res)
      
      expect(mockHandler).toHaveBeenCalledWith(req, res)
      expect(res.status).not.toHaveBeenCalled()
    })

    it('should handle AppError correctly', async () => {
      const mockHandler = jest.fn().mockRejectedValue(new AppError('Test error', 400))
      const wrappedHandler = withErrorHandler(mockHandler)
      
      const req = { url: '/test', method: 'GET' }
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
      
      await wrappedHandler(req, res)
      
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'Test error'
          }),
          statusCode: 400
        })
      )
    })

    it('should handle generic errors', async () => {
      const mockHandler = jest.fn().mockRejectedValue(new Error('Generic error'))
      const wrappedHandler = withErrorHandler(mockHandler)
      
      const req = { url: '/test', method: 'GET' }
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
      
      await wrappedHandler(req, res)
      
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'Internal Server Error'
          }),
          statusCode: 500
        })
      )
    })
  })
})
