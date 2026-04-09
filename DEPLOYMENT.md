# SignFlow Deployment Guide

## Production Deployment Instructions

This guide covers deploying SignFlow to production environments.

### Prerequisites

- Node.js 22+ and npm 10+
- Supabase account with production database instance
- Vercel, Netlify, or self-hosted server
- Domain name (optional)

---

## Environment Setup

### 1. Configure Production Environment Variables

Create `.env.production` with your production values:

```bash
# Supabase Production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Application
NEXT_PUBLIC_APP_URL=https://signflow.yourdomain.com
NODE_ENV=production

# AI Services (Optional)
OPENAI_API_KEY=sk-your-key
```

### 2. Setup Supabase Production Instance

1. **Create production project** in Supabase dashboard
2. **Run migrations** to set up database schema:
   ```bash
   # Use Supabase CLI
   supabase db push --linked
   ```
3. **Enable RLS** (Row Level Security) on all tables
4. **Setup authentication providers** (Email/Password, Google, GitHub)
5. **Configure email templates** for password reset and verification

---

## Deployment Options

### Option A: Deploy to Vercel (Recommended)

**Easiest for Next.js**

1. **Connect repository**
   ```bash
   vercel link
   ```

2. **Set environment variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

3. **Deploy**
   ```bash
   vercel deploy --prod
   ```

4. **Custom domain**
   - Add domain in Vercel dashboard
   - Update DNS records

### Option B: Deploy to Netlify

1. **Connect repository** in Netlify dashboard
2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Environment variables:**
   - Add all env vars from `.env.production`

4. **Deploy** (auto-deploys on git push)

### Option C: Self-Hosted Deployment

**Using Docker**

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:22-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and run:**
   ```bash
   docker build -t signflow .
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_SUPABASE_URL=... \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
     signflow
   ```

3. **Using Docker Compose:**
   ```yaml
   version: '3.8'
   services:
     signflow:
       build: .
       ports:
         - "3000:3000"
       environment:
         NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL}
         NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}
   ```

---

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Supabase production database ready
- [ ] Database migrations applied
- [ ] Authentication providers configured
- [ ] RLS policies enabled
- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] All tests pass (if available)
- [ ] SSL certificate ready (self-hosted)
- [ ] Backup strategy documented
- [ ] Monitoring/logging configured

---

## Post-Deployment Steps

### 1. Verify Deployment

```bash
# Test API endpoints
curl https://signflow.yourdomain.com/api/health

# Test authentication
curl https://signflow.yourdomain.com/api/auth/me
```

### 2. Setup Monitoring

- **Error tracking:** Sentry integration
- **Performance monitoring:** Vercel Analytics or equivalent
- **Uptime monitoring:** Pingdom or UptimeRobot
- **Logs:** CloudWatch, Loggly, or similar

### 3. Configure CI/CD

**GitHub Actions example:**

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        run: vercel deploy --prod --token ${{ secrets.VERCEL_TOKEN }}
```

### 4. Database Backup

**Automated backups:**

1. Enable Supabase automated backups
2. Schedule daily backups
3. Test restore procedure monthly

---

## Scaling Considerations

### As Usage Grows

1. **Database optimization:**
   - Add indexes on frequently queried columns
   - Implement caching layer (Redis)
   - Archive old data

2. **Performance optimization:**
   - Enable CDN (Vercel/Netlify provides this)
   - Implement API rate limiting
   - Optimize images and assets

3. **Infrastructure:**
   - Switch to dedicated database if needed
   - Implement load balancing
   - Use content delivery network (CDN)

---

## Troubleshooting

### Common Issues

**503 Service Unavailable**
- Check Supabase status
- Verify API keys are correct
- Check database connection limits

**Memory issues in production**
- Reduce build size with `npm run build --analyze`
- Implement code splitting
- Monitor serverless function memory

**CORS errors**
- Update CORS configuration in Supabase
- Add domain to allowed origins
- Check API endpoint configuration

### Debug Mode

Enable debug logging:
```bash
DEBUG=signflow:* npm start
```

---

## Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] RLS policies properly configured
- [ ] HTTPS enforced
- [ ] Authentication properly implemented
- [ ] API routes protected with auth checks
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (using Supabase)
- [ ] XSS protection (using React)
- [ ] CSRF tokens implemented (if needed)

---

## Rollback Procedure

If issues occur after deployment:

1. **Vercel:** Redeploy previous version from dashboard
2. **Netlify:** Rollback from deployment history
3. **Self-hosted:** Restart container with previous image

---

## Monitoring & Maintenance

### Daily
- Check error logs
- Monitor uptime
- Review user feedback

### Weekly
- Analyze performance metrics
- Review security logs
- Check for pending updates

### Monthly
- Database maintenance
- Backup verification
- Dependency updates
- Security audit

---

## Support & Resources

- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **GitHub Actions:** https://docs.github.com/en/actions

For issues or questions, refer to the main README.md or open a GitHub issue.
