#!/bin/bash

# VPS Setup Script for Giftsmith Deployment
# Run this script as root on your VPS

set -e

echo "🚀 Starting VPS setup for Giftsmith deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root"
   exit 1
fi

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install essential packages
print_status "Installing essential packages..."
apt install -y curl wget git htop ufw fail2ban

# Prepare deployment directory
print_status "Preparing deployment directory..."
mkdir -p /opt/giftsmith/staging
mkdir -p /opt/giftsmith/production
chmod -R 755 /opt/giftsmith

# Configure firewall
print_status "Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable

# Install fail2ban
print_status "Configuring fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban

echo "================== VPS SETUP GUIDE FOR GIFTSMITH DEPLOYMENT =================="
echo "1. Install Docker:"
echo "   curl -fsSL https://get.docker.com | sh"
echo "2. Install Docker Compose (if not available):"
echo "   DOCKER_COMPOSE_VERSION=\"2.29.2\""
echo "   curl -L \"https://github.com/docker/compose/releases/download/v\${DOCKER_COMPOSE_VERSION}/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose"
echo "   chmod +x /usr/local/bin/docker-compose"
echo "3. Install and configure a self-hosted GitHub Actions runner with the appropriate tag (e.g., prod)"
echo "   See: https://docs.github.com/en/actions/hosting-your-own-runners/adding-self-hosted-runners"
echo "4. Create a .env file with all required environment variables for API and Frontend at:"
echo "   /opt/giftsmith/staging/.env or /opt/giftsmith/production/.env"
echo "   (See project documentation for variable examples)"
echo "5. Ensure the runner user has permission to run Docker"
echo "6. Open ports 9000 (API) and 8000 (Frontend) if needed"
echo "===============================================================================" 