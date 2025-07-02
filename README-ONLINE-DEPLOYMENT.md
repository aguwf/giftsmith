# 🚀 Giftsmith Render Deployment Guide (Neon Postgres)

## 📋 Tổng quan

Hướng dẫn deploy Giftsmith lên Render với 2 services riêng biệt và sử dụng **Neon Postgres** làm database:
- **Backend**: Medusa.js API (giftsmith-api)
- **Frontend**: Next.js Storefront (giftsmith-storefront)
- **Database**: PostgreSQL (Neon)

## 🗄️ Database PostgreSQL (Neon)

### 1. Tạo database trên Neon
1. Đăng ký hoặc đăng nhập tại [https://neon.tech](https://neon.tech)
2. Tạo project mới (chọn region gần nhất)
3. Vào project, chọn **Connection Details** → copy **connection string** dạng:
   ```
   postgresql://USER:PASSWORD@HOST:PORT/DBNAME
   ```
   (Ví dụ: `postgresql://neondb_user:xxxx@ep-xxx.ap-southeast-1.aws.neon.tech/neondb`)

4. (Tùy chọn) Tạo thêm branch cho dev/test/prod nếu cần.

## 🚀 Deployment Platform: Render

### Setup Render:
1. **Đăng ký**: https://render.com
2. **Connect GitHub**: Kết nối repository
3. **Bỏ qua bước tạo PostgreSQL database trên Render** (vì đã dùng Neon)
4. **Create Backend Service**: Tạo Web Service cho giftsmith-api
5. **Create Frontend Service**: Tạo Web Service cho giftsmith-storefront

### Environment Variables trong Render:

#### Backend Service (giftsmith-api):
```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME   # (từ Neon)
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
STORE_CORS=https://your-frontend.onrender.com
ADMIN_CORS=https://your-frontend.onrender.com
AUTH_CORS=https://your-frontend.onrender.com
CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=your_token
CONTENTFUL_DELIVERY_TOKEN=your_token
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ENVIRONMENT=production
```

#### Frontend Service (giftsmith-storefront):
```bash
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_key
MEDUSA_BACKEND_URL=https://your-backend.onrender.com
NEXT_PUBLIC_BASE_URL=https://your-frontend.onrender.com
NEXT_PUBLIC_STRIPE_KEY=your_stripe_key
```

## 🔧 Setup Step by Step

### Step 1: Setup Neon Database
1. Đăng ký tại https://neon.tech
2. Tạo project mới
3. Copy connection string
4. (Tùy chọn) Test connection:
   ```bash
   psql "postgresql://USER:PASSWORD@HOST:PORT/DBNAME"
   ```

### Step 2: Setup Render
1. Đăng ký tại https://render.com
2. Connect GitHub repository
3. Tạo Backend Service (giftsmith-api):
   - Build Command: `yarn build`
   - Start Command: `yarn start`
   - Set environment variables (dán DATABASE_URL từ Neon)
4. Tạo Frontend Service (giftsmith-storefront):
   - Build Command: `yarn build`
   - Start Command: `yarn start`
   - Set environment variables

### Step 3: Deploy
1. Push code:
   ```bash
   git add .
   git commit -m "Setup for Render + Neon deployment"
   git push origin main
   ```
2. Monitor deployment:
   - Vào GitHub Actions tab
   - Xem progress của workflow
   - Check Render dashboard
3. Verify deployment:
   - Backend: `https://your-backend.onrender.com/health`
   - Frontend: `https://your-frontend.onrender.com`

## 🔍 Troubleshooting

### 1. Database Connection Failed
```bash
# Check connection string
echo $DATABASE_URL
# Test connection
psql "$DATABASE_URL" -c "SELECT 1;"
# Check Render logs
# Vào Render dashboard > Service > Logs
```

### 2. Build Failed
```bash
# Check build logs
# Vào Render dashboard > Service > Logs
# Test locally
cd giftsmith-api
yarn install
yarn build
```

### 3. Environment Variables Missing
```bash
# Check Render variables
# Vào Render dashboard > Service > Environment
# Set missing variables
# Vào Environment tab và add variables
```

### 4. CORS Issues
```bash
# Check CORS configuration
echo $STORE_CORS
echo $ADMIN_CORS
echo $AUTH_CORS
# Update CORS URLs
# Vào Render dashboard > Environment variables
```

## 📊 Monitoring
- **Backend**: `https://your-backend.onrender.com/health`
- **Frontend**: `https://your-frontend.onrender.com`
- **Logs**: Render dashboard > Service > Logs
- **Custom Domains**: Render dashboard > Service > Settings > Custom Domains

## 💰 Cost
- **Neon**: Free (3GB storage, 10GB transfer)
- **Render**: Free (750 hours/month/service, 1GB RAM, 1GB outbound traffic)
- **Total**: $0/month

## 🔄 Migration to Production
1. Export data từ Neon:
   ```bash
   pg_dump "$DATABASE_URL" > production_backup.sql
   ```
2. Setup VPS với PostgreSQL:
   ```bash
   psql -h localhost -U user -d database < production_backup.sql
   ```
3. Update environment variables:
   ```bash
   DATABASE_URL=postgresql://user:pass@localhost:5432/database
   ```
4. Deploy to VPS:
   ```bash
   ./deploy-prod.sh deploy
   ```