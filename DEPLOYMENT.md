# ProofPals Deployment Guide

## Quick Start (Local Docker)

1. **Prerequisites**
   - Docker & Docker Compose installed
   - Git (to clone/update code)

2. **Deploy Locally**
   ```bash
   # Make deploy script executable (Linux/Mac)
   chmod +x deploy.sh
   
   # Run deployment
   ./deploy.sh
   ```

3. **Access Your App**
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Cloud Deployment Options

### Option 1: Railway (Recommended - Easiest)

1. **Sign up** at [railway.app](https://railway.app)
2. **Connect your GitHub repo**
3. **Deploy backend**:
   - Create new project
   - Add PostgreSQL & Redis services
   - Deploy from `backend/` folder
   - Set environment variables from `.env.example`
4. **Deploy frontend**:
   - Add new service
   - Deploy from `proofpals-frontend/` folder
   - Set `VITE_API_URL` to your backend URL

### Option 2: DigitalOcean App Platform

1. **Create account** at DigitalOcean
2. **Create new App**
3. **Add components**:
   - Backend: Python service from `backend/`
   - Frontend: Static site from `proofpals-frontend/`
   - Database: PostgreSQL
   - Cache: Redis

### Option 3: VPS Deployment

1. **Get a VPS** (DigitalOcean, Linode, etc.)
2. **Install Docker**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```
3. **Clone your repo** and run `./deploy.sh`
4. **Configure domain** (optional):
   - Point your domain to VPS IP
   - Update nginx config for your domain
   - Add SSL with Let's Encrypt

## IP Address Collection

Your app **already collects IP addresses** in these locations:

### Backend Code
- **Vote endpoint**: `main.py:2180`
  ```python
  ip_address = request.client.host if request.client else None
  ```

- **Rate limiting**: `middleware/rate_limiter.py:164`
  ```python
  client_ip = request.client.host if request.client else "unknown"
  ```

### Important Notes for Production

1. **Reverse Proxy Headers**
   When deployed behind a reverse proxy (nginx, cloudflare), you need to get the real IP:
   ```python
   # Add this to your FastAPI app
   def get_real_ip(request: Request) -> str:
       # Check for forwarded headers first
       forwarded_for = request.headers.get("X-Forwarded-For")
       if forwarded_for:
           return forwarded_for.split(",")[0].strip()
       
       real_ip = request.headers.get("X-Real-IP")
       if real_ip:
           return real_ip
       
       # Fallback to direct client IP
       return request.client.host if request.client else "unknown"
   ```

2. **Privacy Compliance**
   - Consider GDPR/privacy laws
   - Hash IPs for storage: `hashlib.sha256(ip.encode()).hexdigest()`
   - Add privacy policy

3. **Rate Limiting**
   Your app already implements IP-based rate limiting, which is perfect for production.

## Environment Variables

Create `.env` file with:
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname
POSTGRES_PASSWORD=secure_password

# Security
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret

# Redis
REDIS_URL=redis://localhost:6379

# Environment
ENVIRONMENT=production
```

## Monitoring & Logs

- **View logs**: `docker-compose logs -f`
- **Monitor performance**: Your app has built-in performance metrics
- **Health checks**: Included in docker-compose.yml

## Scaling

For high traffic:
1. **Load balancer** (nginx, HAProxy)
2. **Multiple backend instances**
3. **Database connection pooling**
4. **Redis clustering**
5. **CDN for frontend** (Cloudflare, AWS CloudFront)

## Security Checklist

- ✅ IP address logging (already implemented)
- ✅ Rate limiting (already implemented)
- ✅ Authentication system (already implemented)
- ⚠️ HTTPS/SSL (configure in production)
- ⚠️ Firewall rules (configure on VPS)
- ⚠️ Regular backups (database)
- ⚠️ Security headers (add to nginx)

## Troubleshooting

**Common Issues:**
- **Port conflicts**: Change ports in docker-compose.yml
- **Database connection**: Check DATABASE_URL format
- **CORS errors**: Update CORS settings in main.py
- **Build failures**: Check Dockerfile dependencies

**Get Help:**
- Check logs: `docker-compose logs service-name`
- Restart services: `docker-compose restart`
- Rebuild: `docker-compose up --build`
