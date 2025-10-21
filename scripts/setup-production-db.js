#!/usr/bin/env node

/**
 * Production Database Setup Script
 * This script helps setup PostgreSQL database for production
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Setting up Production Database...')

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set')
  console.log('Please set DATABASE_URL to your PostgreSQL connection string')
  console.log('Example: postgresql://username:password@host:port/database')
  process.exit(1)
}

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })

  // Push schema to database
  console.log('🗄️ Pushing schema to database...')
  execSync('npx prisma db push', { stdio: 'inherit' })

  // Seed database if seed file exists
  if (fs.existsSync(path.join(__dirname, '../prisma/seed.js'))) {
    console.log('🌱 Seeding database...')
    execSync('npx prisma db seed', { stdio: 'inherit' })
  }

  console.log('✅ Production database setup completed!')
  console.log('🔗 Database URL:', process.env.DATABASE_URL)
  
} catch (error) {
  console.error('❌ Database setup failed:', error.message)
  process.exit(1)
}
