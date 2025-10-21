import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const startTime = Date.now()
    
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    const dbResponseTime = Date.now() - startTime
    
    // Check environment variables
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      OPENAI_API_KEY: !!process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      GOOGLE_API_KEY: !!process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
      DEEPSEEK_API_KEY: !!process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY,
      GROK_API_KEY: !!process.env.NEXT_PUBLIC_GROK_API_KEY,
    }
    
    // Check AI services
    const aiServices = {
      openai: !!process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      google: !!process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
      deepseek: !!process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY,
      grok: !!process.env.NEXT_PUBLIC_GROK_API_KEY,
    }
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV,
      database: {
        status: 'connected',
        responseTime: `${dbResponseTime}ms`
      },
      environment: envCheck,
      aiServices,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB'
      }
    }
    
    return NextResponse.json(health, { status: 200 })
    
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      database: {
        status: 'disconnected',
        error: error instanceof Error ? error.message : 'Database connection failed'
      }
    }, { status: 503 })
    
  } finally {
    await prisma.$disconnect()
  }
}
