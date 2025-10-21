#!/usr/bin/env node

/**
 * Health Check Script
 * Checks if all services are running properly
 */

const { execSync } = require('child_process')
const https = require('https')
const http = require('http')

console.log('🏥 Running Health Checks...')

// Check database connection
async function checkDatabase() {
  try {
    console.log('🗄️ Checking database connection...')
    execSync('npx prisma db pull --print', { stdio: 'pipe' })
    console.log('✅ Database connection: OK')
    return true
  } catch (error) {
    console.log('❌ Database connection: FAILED')
    console.log('Error:', error.message)
    return false
  }
}

// Check API endpoints
async function checkAPI() {
  const endpoints = [
    'http://localhost:3000/api/health',
    'http://localhost:3000/api/courses',
    'http://localhost:3000/api/ai/test'
  ]

  for (const endpoint of endpoints) {
    try {
      console.log(`🌐 Checking ${endpoint}...`)
      await new Promise((resolve, reject) => {
        const client = endpoint.startsWith('https') ? https : http
        const req = client.get(endpoint, (res) => {
          if (res.statusCode >= 200 && res.statusCode < 400) {
            console.log(`✅ ${endpoint}: OK (${res.statusCode})`)
            resolve()
          } else {
            console.log(`❌ ${endpoint}: FAILED (${res.statusCode})`)
            reject(new Error(`HTTP ${res.statusCode}`))
          }
        })
        req.on('error', reject)
        req.setTimeout(5000, () => reject(new Error('Timeout')))
      })
    } catch (error) {
      console.log(`❌ ${endpoint}: FAILED`)
      console.log('Error:', error.message)
    }
  }
}

// Check environment variables
function checkEnvironment() {
  console.log('🔧 Checking environment variables...')
  
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ]

  const optional = [
    'NEXT_PUBLIC_OPENAI_API_KEY',
    'NEXT_PUBLIC_GOOGLE_API_KEY',
    'NEXT_PUBLIC_DEEPSEEK_API_KEY',
    'NEXT_PUBLIC_GROK_API_KEY'
  ]

  let allGood = true

  required.forEach(env => {
    if (process.env[env]) {
      console.log(`✅ ${env}: Set`)
    } else {
      console.log(`❌ ${env}: Missing (REQUIRED)`)
      allGood = false
    }
  })

  optional.forEach(env => {
    if (process.env[env]) {
      console.log(`✅ ${env}: Set`)
    } else {
      console.log(`⚠️ ${env}: Missing (Optional)`)
    }
  })

  return allGood
}

// Main health check
async function runHealthCheck() {
  console.log('🏥 Starting Health Check...\n')

  const envOk = checkEnvironment()
  const dbOk = await checkDatabase()
  
  if (process.env.NODE_ENV === 'development') {
    await checkAPI()
  }

  console.log('\n📊 Health Check Summary:')
  console.log(`Environment: ${envOk ? '✅' : '❌'}`)
  console.log(`Database: ${dbOk ? '✅' : '❌'}`)
  
  if (envOk && dbOk) {
    console.log('\n🎉 All systems are healthy!')
    process.exit(0)
  } else {
    console.log('\n⚠️ Some issues found. Please check the logs above.')
    process.exit(1)
  }
}

runHealthCheck().catch(console.error)
