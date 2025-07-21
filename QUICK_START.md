# Quick Start Guide - VPS Deployment

This guide will help you deploy Giftsmith to your VPS in under 30 minutes.

## 🚀 Step 1: VPS Setup (5 minutes)

1. **Connect to your VPS as root:**
   ```bash
   ssh root@your-vps-ip
   ```

2. **Run the setup script:**
   ```bash
   curl -fsSL https://raw.githubusercontent.com/your-username/giftsmith/main/scripts/setup-vps.sh | bash
   ```

3. **Copy the SSH key:**
   ```bash
   cat /home/deploy/.ssh/id_ed25519
   ```

## 🔑 Step 2: GitHub Configuration (5 minutes)

1. **Go to your GitHub repository**
2. **Navigate to Settings → Secrets and variables → Actions**
3. **Add these secrets:**
   - `VPS_HOST`: Your VPS IP address
   - `VPS_USERNAME`: `deploy`
   - `VPS_SSH_KEY`: The SSH private key from step 1
   - `VPS_PORT`: `22`

## 🌐 Step 3: Domain & SSL Setup (5 minutes)

1. **Point your domain to your VPS IP**
2. **Generate SSL certificate:**
   ```bash
   certbot certonly --standalone -d your-domain.com
   ```
3. **Copy certificates:**
   ```bash
   cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /opt/giftsmith/ssl/cert.pem
   cp /etc/letsencrypt/live/your-domain.com/privkey.pem /opt/giftsmith/ssl/key.pem
   chown deploy:deploy /opt/giftsmith/ssl/*
   ```

## ⚙️ Step 4: Environment Variables (10 minutes)

1. **Run the environment template script:**
   ```bash
   curl -fsSL https://raw.githubusercontent.com/your-username/giftsmith/main/scripts/env-template.sh | bash
   ```

2. **Add all the environment variables to GitHub secrets** (replace placeholder values)

## 🚀 Step 5: Deploy (5 minutes)

1. **Push your code to main branch**
2. **Go to Actions tab in GitHub**
3. **Monitor the deployment**
4. **Visit your domain to verify it's working**

## ✅ Verification

Your deployment should be accessible at:
- **Frontend**: `https://your-domain.com`
- **API**: `https://your-domain.com/api`
- **Admin**: `https://your-domain.com/admin`

## 🔧 Troubleshooting

### Common Issues:

1. **Port 80/443 not accessible**
   - Check firewall: `ufw status`
   - Ensure ports are open: `ufw allow 80 && ufw allow 443`

2. **SSL certificate issues**
   - Verify domain DNS is pointing to VPS
   - Check certificate paths: `ls -la /opt/giftsmith/ssl/`

3. **Database connection failed**
   - Check PostgreSQL is running: `systemctl status postgresql`
   - Verify database exists: `sudo -u postgres psql -l`

4. **Docker containers not starting**
   - Check logs: `docker-compose -f /opt/giftsmith/production/docker-compose.production.yml logs`
   - Verify images exist: `docker images`

### Useful Commands:

```bash
# Check service status
docker-compose -f /opt/giftsmith/production/docker-compose.production.yml ps

# View logs
docker-compose -f /opt/giftsmith/production/docker-compose.production.yml logs -f

# Restart services
docker-compose -f /opt/giftsmith/production/docker-compose.production.yml restart

# Check system resources
htop
df -h
free -h
```

## 📞 Support

If you encounter issues:

1. **Check the logs first** (see troubleshooting above)
2. **Review the full deployment guide**: `DEPLOYMENT.md`
3. **Check GitHub Actions workflow logs**
4. **Contact the development team**

## 🎉 Success!

Once deployed, your Giftsmith application will be:
- ✅ Running on HTTPS with SSL
- ✅ Protected by firewall
- ✅ Backed up daily
- ✅ Auto-renewing SSL certificates
- ✅ Ready for production use

---

**Next Steps:**
- Set up monitoring (optional)
- Configure custom domain
- Set up email notifications
- Review security settings

For detailed information, see `DEPLOYMENT.md` 