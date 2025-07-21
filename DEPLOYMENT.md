# VPS Deployment Guide

This guide explains how to deploy the Giftsmith application to your VPS using Docker and GitHub Actions.

## Prerequisites

1. **VPS Requirements:**
   - Ubuntu 20.04+ or CentOS 8+
   - At least 2GB RAM
   - 20GB+ storage
   - Docker and Docker Compose installed
   - Nginx (optional, included in deployment)

2. **Domain Name:**
   - A domain name pointing to your VPS
   - SSL certificate (Let's Encrypt recommended)

3. **GitHub Repository:**
   - Repository with the application code
   - GitHub Actions enabled

## VPS Setup

### 1. Install Docker and Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes to take effect
```

### 2. Create Deployment User

```bash
# Create deployment user
sudo adduser deploy
sudo usermod -aG docker deploy

# Switch to deploy user
sudo su - deploy
```

### 3. Setup SSH Key Authentication

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "deploy@your-domain.com"

# Add public key to authorized_keys
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Copy private key content (you'll need this for GitHub secrets)
cat ~/.ssh/id_ed25519
```

### 4. Create SSL Certificate Directory

```bash
# Create SSL directory
sudo mkdir -p /opt/giftsmith/ssl
sudo chown deploy:deploy /opt/giftsmith/ssl

# If using Let's Encrypt
sudo apt install certbot
sudo certbot certonly --standalone -d your-domain.com
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /opt/giftsmith/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /opt/giftsmith/ssl/key.pem
sudo chown deploy:deploy /opt/giftsmith/ssl/*
```

## GitHub Repository Setup

### 1. Add Repository Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add the following secrets:

- `VPS_HOST`: Your VPS IP address or domain
- `VPS_USERNAME`: `deploy` (or your deployment user)
- `VPS_SSH_KEY`: The private SSH key content
- `VPS_PORT`: SSH port (usually 22)

### 2. Add Environment Variables

For each environment (staging/production), add these secrets:

**Backend Environment Variables:**
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: 32+ character secret
- `COOKIE_SECRET`: 32+ character secret
- `STORE_CORS`: Frontend URL for CORS
- `ADMIN_CORS`: Admin URL for CORS
- `AUTH_CORS`: Auth URL for CORS
- `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN`: Contentful management token
- `CONTENTFUL_DELIVERY_TOKEN`: Contentful delivery token
- `CONTENTFUL_SPACE_ID`: Contentful space ID
- `CONTENTFUL_ENVIRONMENT`: `production`

**Frontend Environment Variables:**
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`: Medusa publishable key
- `MEDUSA_BACKEND_URL`: Backend API URL
- `NEXT_PUBLIC_BASE_URL`: Frontend URL
- `NEXT_PUBLIC_STRIPE_KEY`: Stripe publishable key

## Database Setup

### PostgreSQL Setup

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql

CREATE DATABASE giftsmith_production;
CREATE DATABASE giftsmith_staging;
CREATE USER giftsmith WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE giftsmith_production TO giftsmith;
GRANT ALL PRIVILEGES ON DATABASE giftsmith_staging TO giftsmith;
\q

# Update PostgreSQL configuration
sudo nano /etc/postgresql/*/main/postgresql.conf
# Add: listen_addresses = '*'

sudo nano /etc/postgresql/*/main/pg_hba.conf
# Add: host    all             all             0.0.0.0/0               md5

sudo systemctl restart postgresql
```

### Redis Setup

```bash
# Install Redis
sudo apt install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
# Change: bind 0.0.0.0

sudo systemctl restart redis
```

## Deployment Process

### 1. Automatic Deployment

The GitHub Actions workflow will automatically:

1. **Security Scan**: Run Trivy vulnerability scanner
2. **Testing**: Run backend and frontend tests
3. **Build**: Build Docker images for both services
4. **Push**: Push images to GitHub Container Registry
5. **Deploy**: Deploy to VPS using Docker Compose
6. **Health Check**: Verify services are running
7. **Rollback**: Rollback on failure

### 2. Manual Deployment

You can trigger manual deployments:

1. Go to Actions tab in GitHub
2. Select "Deploy to VPS" workflow
3. Click "Run workflow"
4. Choose environment (staging/production)
5. Click "Run workflow"

### 3. Environment Management

The deployment creates separate environments:

- **Staging**: `/opt/giftsmith/staging/`
- **Production**: `/opt/giftsmith/production/`

Each environment has its own:
- Docker Compose file
- Nginx configuration
- Environment variables
- SSL certificates

## Monitoring and Maintenance

### 1. Logs

```bash
# View logs
docker-compose -f /opt/giftsmith/production/docker-compose.production.yml logs -f

# View specific service logs
docker-compose -f /opt/giftsmith/production/docker-compose.production.yml logs -f api
```

### 2. Health Checks

```bash
# Check service status
docker-compose -f /opt/giftsmith/production/docker-compose.production.yml ps

# Manual health check
curl -f https://your-domain.com/health
```

### 3. Backup

```bash
# Backup database
pg_dump -h localhost -U giftsmith giftsmith_production > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup uploads
tar -czf uploads_backup_$(date +%Y%m%d_%H%M%S).tar.gz /opt/giftsmith/production/uploads/
```

### 4. SSL Certificate Renewal

```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Copy renewed certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /opt/giftsmith/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /opt/giftsmith/ssl/key.pem
sudo chown deploy:deploy /opt/giftsmith/ssl/*

# Restart nginx
docker-compose -f /opt/giftsmith/production/docker-compose.production.yml restart nginx
```

## Security Considerations

### 1. Firewall Setup

```bash
# Install UFW
sudo apt install ufw

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Regular Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose -f /opt/giftsmith/production/docker-compose.production.yml pull
docker-compose -f /opt/giftsmith/production/docker-compose.production.yml up -d
```

### 3. Monitoring

Consider setting up monitoring tools:
- Prometheus + Grafana
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Simple uptime monitoring with UptimeRobot

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 80, 443, 9000, 8000 are available
2. **Permission Issues**: Check file ownership in `/opt/giftsmith/`
3. **SSL Issues**: Verify certificate paths and permissions
4. **Database Connection**: Check PostgreSQL configuration and firewall
5. **Memory Issues**: Monitor system resources and adjust Docker limits

### Debug Commands

```bash
# Check Docker status
docker ps -a
docker logs <container_name>

# Check system resources
htop
df -h
free -h

# Check network connectivity
netstat -tulpn
ss -tulpn
```

## Support

For issues or questions:
1. Check the logs first
2. Review this documentation
3. Check GitHub Actions workflow logs
4. Contact the development team 