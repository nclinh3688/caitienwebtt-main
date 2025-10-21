/**
 * Centralized error handling system
 */

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429);
  }
}

// Error logging
export function logError(error: Error, context?: any) {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    message: error.message,
    stack: error.stack,
    context,
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
  };

  // In production, send to logging service (Sentry, LogRocket, etc.)
  if (process.env.NODE_ENV === 'production') {
    console.error('Production Error:', errorInfo);
    // TODO: Send to external logging service
  } else {
    console.error('Development Error:', errorInfo);
  }
}

// API Error Response Helper
export function createErrorResponse(error: Error, statusCode: number = 500) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    error: {
      message: error.message,
      ...(isDevelopment && { stack: error.stack }),
      timestamp: new Date().toISOString(),
    },
    statusCode,
  };
}

// Global Error Handler for API Routes
export function withErrorHandler(handler: Function) {
  return async (req: any, res: any) => {
    try {
      return await handler(req, res);
    } catch (error) {
      logError(error as Error, { req: req.url, method: req.method });
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json(createErrorResponse(error, error.statusCode));
      }
      
      return res.status(500).json(createErrorResponse(new Error('Internal Server Error')));
    }
  };
}
