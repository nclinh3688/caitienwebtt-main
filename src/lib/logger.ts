/**
 * Centralized Logging System
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  service?: string
  userId?: string
  requestId?: string
  metadata?: Record<string, any>
  error?: Error
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, service, userId, requestId, metadata, error } = entry
    
    let formatted = `[${timestamp}] [${level.toUpperCase()}]`
    
    if (service) formatted += ` [${service}]`
    if (userId) formatted += ` [user:${userId}]`
    if (requestId) formatted += ` [req:${requestId}]`
    
    formatted += ` ${message}`
    
    if (metadata && Object.keys(metadata).length > 0) {
      formatted += ` | Metadata: ${JSON.stringify(metadata)}`
    }
    
    if (error) {
      formatted += ` | Error: ${error.message}`
      if (this.isDevelopment && error.stack) {
        formatted += ` | Stack: ${error.stack}`
      }
    }
    
    return formatted
  }

  private log(entry: LogEntry): void {
    const formatted = this.formatMessage(entry)
    
    // Console logging
    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(formatted)
        break
      case LogLevel.WARN:
        console.warn(formatted)
        break
      case LogLevel.INFO:
        console.info(formatted)
        break
      case LogLevel.DEBUG:
        if (this.isDevelopment) {
          console.debug(formatted)
        }
        break
    }
    
    // In production, send to external logging service
    if (this.isProduction) {
      this.sendToExternalService(entry)
    }
  }

  private sendToExternalService(entry: LogEntry): void {
    // TODO: Implement external logging service (Sentry, LogRocket, etc.)
    // For now, we'll just store in memory or send to a webhook
    if (process.env.LOG_WEBHOOK_URL) {
      fetch(process.env.LOG_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      }).catch(err => console.error('Failed to send log to external service:', err))
    }
  }

  error(message: string, error?: Error, metadata?: Record<string, any>, context?: { service?: string; userId?: string; requestId?: string }): void {
    this.log({
      level: LogLevel.ERROR,
      message,
      timestamp: new Date().toISOString(),
      error,
      metadata,
      ...context
    })
  }

  warn(message: string, metadata?: Record<string, any>, context?: { service?: string; userId?: string; requestId?: string }): void {
    this.log({
      level: LogLevel.WARN,
      message,
      timestamp: new Date().toISOString(),
      metadata,
      ...context
    })
  }

  info(message: string, metadata?: Record<string, any>, context?: { service?: string; userId?: string; requestId?: string }): void {
    this.log({
      level: LogLevel.INFO,
      message,
      timestamp: new Date().toISOString(),
      metadata,
      ...context
    })
  }

  debug(message: string, metadata?: Record<string, any>, context?: { service?: string; userId?: string; requestId?: string }): void {
    this.log({
      level: LogLevel.DEBUG,
      message,
      timestamp: new Date().toISOString(),
      metadata,
      ...context
    })
  }

  // API-specific logging
  apiRequest(method: string, url: string, userId?: string, requestId?: string): void {
    this.info(`API Request: ${method} ${url}`, {}, { service: 'api', userId, requestId })
  }

  apiResponse(method: string, url: string, statusCode: number, responseTime: number, userId?: string, requestId?: string): void {
    this.info(`API Response: ${method} ${url} - ${statusCode} (${responseTime}ms)`, 
      { statusCode, responseTime }, 
      { service: 'api', userId, requestId }
    )
  }

  // AI-specific logging
  aiRequest(provider: string, model: string, tokens: number, userId?: string): void {
    this.info(`AI Request: ${provider}/${model}`, { tokens }, { service: 'ai', userId })
  }

  aiResponse(provider: string, model: string, responseTime: number, tokens: number, userId?: string): void {
    this.info(`AI Response: ${provider}/${model} - ${responseTime}ms`, 
      { responseTime, tokens }, 
      { service: 'ai', userId }
    )
  }

  // Database-specific logging
  dbQuery(query: string, duration: number, userId?: string): void {
    this.debug(`DB Query: ${query}`, { duration }, { service: 'database', userId })
  }

  dbError(query: string, error: Error, userId?: string): void {
    this.error(`DB Error: ${query}`, error, {}, { service: 'database', userId })
  }

  // User action logging
  userAction(action: string, metadata?: Record<string, any>, userId?: string): void {
    this.info(`User Action: ${action}`, metadata, { service: 'user', userId })
  }

  // Security logging
  securityEvent(event: string, metadata?: Record<string, any>, userId?: string): void {
    this.warn(`Security Event: ${event}`, metadata, { service: 'security', userId })
  }
}

export const logger = new Logger()
export default logger
