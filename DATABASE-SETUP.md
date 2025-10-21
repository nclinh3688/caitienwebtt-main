# 🗄️ Database Setup Guide

## Tạo Production Database

### Option 1: PlanetScale (Khuyến nghị)
1. Truy cập: https://planetscale.com
2. Đăng ký account miễn phí
3. Tạo database mới: `caitienwebtt-prod`
4. Lấy connection string

### Option 2: Supabase
1. Truy cập: https://supabase.com
2. Tạo project mới
3. Lấy connection string từ Settings > Database

### Option 3: Neon
1. Truy cập: https://neon.tech
2. Tạo database mới
3. Lấy connection string

## Cấu hình Environment Variables

Thêm vào Vercel Dashboard:
```
DATABASE_URL=postgresql://username:password@host:port/database?schema=public
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app
```

## Migration Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema to production database
npx prisma db push

# Seed production data (optional)
npx prisma db seed
```
