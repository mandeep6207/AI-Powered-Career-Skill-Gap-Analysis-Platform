# Deployment Guide

## Overview
SkillGap Navigator is a full-stack web application that can be deployed to various platforms. This guide covers deployment options.

## Prerequisites
- Docker & Docker Compose (recommended)
- Node.js 18+ (for local frontend development)
- Python 3.13+ (for backend development)
- Git

## Docker Deployment (Recommended)

### Local Docker Deployment
```bash
# Clone repository
git clone https://github.com/mandeep6207/AI-Powered-Career-Skill-Gap-Analysis-Platform.git
cd AI-Powered-Career-Skill-Gap-Analysis-Platform

# Build and run with Docker Compose
docker-compose up --build

# Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### Configure Environment
```bash
# Copy .env.example to .env
cp .env.example .env

# Update .env with your values
nano .env
```

## Production Deployment

### Cloud Platforms

#### Heroku
```bash
# Login to Heroku
heroku login

# Create app
heroku create skillgap-navigator

# Set environment variables
heroku config:set FLASK_ENV=production
heroku config:set SECRET_KEY=your-production-secret

# Deploy
git push heroku main
```

#### AWS EC2
```bash
# SSH into instance
ssh -i key.pem ubuntu@your-ec2-ip

# Clone repo
git clone https://github.com/mandeep6207/AI-Powered-Career-Skill-Gap-Analysis-Platform.git

# Run Docker
docker-compose up -d

# Set up reverse proxy (nginx)
sudo apt-get install nginx
# Configure nginx to proxy to localhost:3000 and localhost:5000
```

#### Railway.app
```bash
# Push to main branch
git push origin main

# Railway auto-detects Docker and deploys
# Configure environment variables in Railway dashboard
```

## Manual Deployment (Linux/Ubuntu)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run with Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend Setup
```bash
cd frontend
npm install
npm run build

# Serve with production server
npm install -g serve
serve -s dist -l 3000
```

### Systemd Services
Create `/etc/systemd/system/skillgap-backend.service`:
```ini
[Unit]
Description=SkillGap Navigator Backend
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/path/to/backend
ExecStart=/path/to/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

## Monitoring & Logging

### View Logs
```bash
# Docker logs
docker-compose logs -f backend

# System logs
tail -f logs/skillgap_app.log
```

### Database Backups
```bash
# Backup SQLite database
cp backend/database.db backup/database.db.$(date +%Y%m%d)

# Or use cron for automated backups
0 2 * * * cp /path/to/database.db /path/to/backup/database.db.$(date +%Y%m%d)
```

## Performance Optimization

1. **Enable Caching**: Check recommender.py caching implementation (1-hour TTL)
2. **Database Indexing**: Add indexes on frequently queried columns
3. **CDN**: Use CloudFront or Cloudflare for static assets
4. **Rate Limiting**: Configured at 100 requests per 60 seconds per IP

## Security Checklist

- [ ] Set strong SECRET_KEY in production
- [ ] Enable HTTPS (use Let's Encrypt with nginx)
- [ ] Update dependencies regularly
- [ ] Configure firewall rules
- [ ] Enable database backups
- [ ] Monitor logs for suspicious activity
- [ ] Use environment variables for sensitive data
- [ ] Enable CORS only for trusted domains

## Troubleshooting

### Database Lock Error
```bash
# Restart services
docker-compose restart backend
```

### Port Already in Use
```bash
# Change port in docker-compose.yml or kill process
lsof -i :5000
kill -9 <PID>
```

### Out of Memory
```bash
# Increase Docker memory limit
# Edit docker-compose.yml: mem_limit: 2g
```

## Support & Maintenance

- Regular deployments: `git pull && docker-compose up --build`
- Monitor database size
- Clean old logs periodically
- Update dependencies monthly
- Review security headers in app.py
