import { PerformanceMonitor } from '@/lib/performance'

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor

  beforeEach(() => {
    monitor = PerformanceMonitor.getInstance()
  })

  it('should measure sync operations', () => {
    const result = monitor.measureSync('test-sync', () => {
      return 'test result'
    })

    expect(result).toBe('test result')
  })

  it('should measure async operations', async () => {
    const result = await monitor.measureAsync('test-async', async () => {
      await new Promise(resolve => setTimeout(resolve, 10))
      return 'async result'
    })

    expect(result).toBe('async result')
  })

  it('should track timing correctly', () => {
    monitor.startTimer('test-timer')
    
    // Simulate some work
    const start = performance.now()
    while (performance.now() - start < 5) {
      // Busy wait
    }
    
    const duration = monitor.endTimer('test-timer')
    expect(duration).toBeGreaterThan(0)
  })

  it('should warn about slow operations', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
    
    monitor.startTimer('slow-operation')
    // Simulate slow operation
    const start = performance.now()
    while (performance.now() - start < 100) {
      // Busy wait
    }
    monitor.endTimer('slow-operation')

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Slow operation detected')
    )
    
    consoleSpy.mockRestore()
  })
})
