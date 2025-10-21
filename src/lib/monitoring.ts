/**
 * Performance Monitoring System
 */

import { logger } from './logger'

export interface PerformanceMetrics {
  timestamp: string
  service: string
  operation: string
  duration: number
  memoryUsage: number
  cpuUsage?: number
  metadata?: Record<string, any>
}

export interface SystemMetrics {
  timestamp: string
  uptime: number
  memory: {
    used: number
    total: number
    percentage: number
  }
  cpu: {
    usage: number
  }
  database: {
    connections: number
    queries: number
    avgResponseTime: number
  }
  api: {
    requests: number
    avgResponseTime: number
    errorRate: number
  }
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private maxMetrics = 1000 // Keep last 1000 metrics

  // Track performance of operations
  async trackOperation<T>(
    service: string,
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const startTime = performance.now()
    const startMemory = process.memoryUsage().heapUsed

    try {
      const result = await fn()
      const endTime = performance.now()
      const endMemory = process.memoryUsage().heapUsed

      const metric: PerformanceMetrics = {
        timestamp: new Date().toISOString(),
        service,
        operation,
        duration: endTime - startTime,
        memoryUsage: endMemory - startMemory,
        metadata
      }

      this.recordMetric(metric)
      logger.debug(`Operation completed: ${service}/${operation}`, { duration: metric.duration })

      return result
    } catch (error) {
      const endTime = performance.now()
      const metric: PerformanceMetrics = {
        timestamp: new Date().toISOString(),
        service,
        operation,
        duration: endTime - startTime,
        memoryUsage: 0,
        metadata: { ...metadata, error: true }
      }

      this.recordMetric(metric)
      logger.error(`Operation failed: ${service}/${operation}`, error as Error, metadata)
      throw error
    }
  }

  // Record a metric
  recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric)
    
    // Keep only last maxMetrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }

    // Log slow operations
    if (metric.duration > 1000) { // 1 second
      logger.warn(`Slow operation detected: ${metric.service}/${metric.operation}`, {
        duration: metric.duration,
        memoryUsage: metric.memoryUsage
      })
    }
  }

  // Get system metrics
  getSystemMetrics(): SystemMetrics {
    const memoryUsage = process.memoryUsage()
    const totalMemory = memoryUsage.heapTotal + memoryUsage.external

    return {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(totalMemory / 1024 / 1024), // MB
        percentage: Math.round((memoryUsage.heapUsed / totalMemory) * 100)
      },
      cpu: {
        usage: 0 // TODO: Implement CPU usage monitoring
      },
      database: {
        connections: 0, // TODO: Get from Prisma
        queries: this.metrics.filter(m => m.service === 'database').length,
        avgResponseTime: this.getAverageResponseTime('database')
      },
      api: {
        requests: this.metrics.filter(m => m.service === 'api').length,
        avgResponseTime: this.getAverageResponseTime('api'),
        errorRate: this.getErrorRate('api')
      }
    }
  }

  // Get metrics for a specific service
  getServiceMetrics(service: string, timeWindow?: number): PerformanceMetrics[] {
    let metrics = this.metrics.filter(m => m.service === service)
    
    if (timeWindow) {
      const cutoff = Date.now() - timeWindow
      metrics = metrics.filter(m => new Date(m.timestamp).getTime() > cutoff)
    }
    
    return metrics
  }

  // Get average response time for a service
  getAverageResponseTime(service: string): number {
    const serviceMetrics = this.metrics.filter(m => m.service === service)
    if (serviceMetrics.length === 0) return 0
    
    const totalDuration = serviceMetrics.reduce((sum, m) => sum + m.duration, 0)
    return Math.round(totalDuration / serviceMetrics.length)
  }

  // Get error rate for a service
  getErrorRate(service: string): number {
    const serviceMetrics = this.metrics.filter(m => m.service === service)
    if (serviceMetrics.length === 0) return 0
    
    const errorCount = serviceMetrics.filter(m => m.metadata?.error).length
    return Math.round((errorCount / serviceMetrics.length) * 100)
  }

  // Get performance summary
  getPerformanceSummary(): {
    totalOperations: number
    averageResponseTime: number
    slowestOperations: Array<{ service: string; operation: string; duration: number }>
    errorRate: number
  } {
    const totalOperations = this.metrics.length
    const averageResponseTime = this.metrics.length > 0 
      ? Math.round(this.metrics.reduce((sum, m) => sum + m.duration, 0) / this.metrics.length)
      : 0
    
    const slowestOperations = this.metrics
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5)
      .map(m => ({
        service: m.service,
        operation: m.operation,
        duration: Math.round(m.duration)
      }))
    
    const errorCount = this.metrics.filter(m => m.metadata?.error).length
    const errorRate = totalOperations > 0 ? Math.round((errorCount / totalOperations) * 100) : 0

    return {
      totalOperations,
      averageResponseTime,
      slowestOperations,
      errorRate
    }
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics = []
    logger.info('Performance metrics cleared')
  }
}

export const performanceMonitor = new PerformanceMonitor()
export default performanceMonitor
