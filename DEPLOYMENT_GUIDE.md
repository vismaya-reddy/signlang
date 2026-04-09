# SignFlow Production Deployment Guide

**Project:** SignFlow - AI-powered Sign Language Learning Platform
**Status:** Ready for Production Deployment
**Last Updated:** 2026-04-09

---

## 📊 Deployment Checklist

### ✅ Phase 1: Environment Preparation (ACTIVE)

#### 1.1 Production Environment Variables

**Current Status:** Template created at `.env.production`

**Required Actions:**
```bash
# Update .env.production with:
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
NEXT_PUBLIC_APP_URL=https://signflow-production.com  # Your domain
NODE_ENV=production
```

**Files:**
- Template: `/workspace/web/.env.example`
- Production: `/workspace/web/.env.production`
- Local: `/workspace/web/.env.local` (dev only)

**DO NOT COMMIT:**
- `.env` files containing secrets
- `.env.local` (development only)
- `.next/` directory
- `node_modules/` directory

---

### ✅ Phase 2: Repository & Version Control

#### 2.1 Git Configuration

**File:** `/workspace/web/.gitignore`

**Current Configuration:**
```gitignore
# dependencies
/node_modules
/.pnp
.pnp.*

# next.js
/.next/
/out/

# production
/build

# env files
.env*

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

.idea
```

**Status:** ✅ Already configured correctly

#### 2.2 GitHub Repository Setup

**Requirements:**
1. Create GitHub repository: `signflow` or `signflow-platform`
2. Initialize with main branch
3. Add team members as collaborators
4. Enable branch protection rules

**Commands:**
```bash
cd /workspace/web
git init
git add .
git commit -m "Initial commit: SignFlow authentication and lessons system

🦝 Co-created with Raccoon AI

Co-Authored-By: ACE <ace@raccoonai.tech>"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/signflow.git
git push -u origin main
```

---

### ✅ Phase 3: Deployment Platform Setup (Vercel)

#### 3.1 Vercel Project Creation

**Steps:**
1. Go to https://vercel.com
2. Click "New Project"
3. Import GitHub repository `signflow`
4. Configure project:
   - Framework: Next.js
   - Build Command: `npm run build` (default)
   - Start Command: `npm start` (default)
   - Output Directory: `.next` (default)

#### 3.2 Environment Variables in Vercel

**Required Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
NEXT_PUBLIC_APP_URL=https://signflow-production.vercel.app
NODE_ENV=production
```

**Setup in Vercel:**
1. Go to Project Settings → Environment Variables
2. Add each variable for all environments (Production, Preview, Development)
3. Redeploy after adding variables

#### 3.3 Custom Domain Configuration

**Steps:**
1. Purchase domain (e.g., signflow.com)
2. In Vercel: Settings → Domains
3. Add your domain
4. Update DNS records at your registrar:
   - A Record: `76.76.19.132`
   - CNAME Record: `cname.vercel-dns.com`
5. Wait for DNS propagation (5-48 hours)
6. Enable SSL: Automatic (Vercel handles it)

---

### ✅ Phase 4: Database Setup (Production Supabase)

#### 4.1 Create Production Supabase Project

**Steps:**
1. Go to https://app.supabase.com
2. Click "New Project"
3. Configure:
   - Name: `signflow-production`
   - Region: Closest to your users
   - Database Password: Strong, unique
   - Plan: Pro ($25/month) for production

#### 4.2 Create Production Tables

**Execute this SQL in Supabase SQL Editor:**

```sql
-- Create users_profile table
CREATE TABLE IF NOT EXISTS public.users_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  level INTEGER DEFAULT 1 NOT NULL,
  xp INTEGER DEFAULT 0 NOT NULL,
  current_streak INTEGER DEFAULT 0 NOT NULL,
  longest_streak INTEGER DEFAULT 0 NOT NULL,
  last_practice_date DATE,
  total_lessons_completed INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users_profile(user_id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  accuracy_score INTEGER DEFAULT 0 NOT NULL,
  attempts INTEGER DEFAULT 1 NOT NULL,
  last_attempted TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, lesson_id)
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('alphabet', 'number', 'word')),
  media_url TEXT,
  description TEXT,
  difficulty_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(title, type)
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for users_profile
CREATE POLICY "users_can_view_own_profile" ON public.users_profile
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_profile" ON public.users_profile
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "public_can_read_profiles" ON public.users_profile
  FOR SELECT USING (true);

-- Create RLS Policies for user_progress
CREATE POLICY "users_can_view_own_progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.users_profile WHERE id = user_id));

CREATE POLICY "users_can_insert_own_progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.users_profile WHERE id = user_id));

-- Create RLS Policies for lessons
CREATE POLICY "anyone_can_read_lessons" ON public.lessons
  FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_profile_user_id ON public.users_profile(user_id);
CREATE INDEX IF NOT EXISTS idx_users_profile_email ON public.users_profile(email);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON public.user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lessons_type ON public.lessons(type);
```

#### 4.3 Disable Email Confirmation (if using implicit auth)

In Supabase Dashboard:
1. Go to Authentication → Providers → Email
2. Turn OFF "Confirm email" toggle
3. Click Save

#### 4.4 Configure Auth Settings

In Supabase Dashboard → Authentication → Settings:
1. Site URL: `https://signflow-production.vercel.app` (or your domain)
2. Redirect URLs: Add all callback URLs
3. JWT expiry: 3600 seconds (1 hour)
4. External OAuth Providers: Enable Google/GitHub if using

---

### ✅ Phase 5: Seed Initial Data

#### 5.1 Insert Sample Lessons

```sql
INSERT INTO public.lessons (title, type, media_url, description) VALUES
-- Alphabets
('A', 'alphabet', 'https://example.com/alphabet-a.jpg', 'Learn to sign the letter A'),
('B', 'alphabet', 'https://example.com/alphabet-b.jpg', 'Learn to sign the letter B'),
('C', 'alphabet', 'https://example.com/alphabet-c.jpg', 'Learn to sign the letter C'),
-- Numbers
('1', 'number', 'https://example.com/number-1.jpg', 'Learn to sign the number 1'),
('2', 'number', 'https://example.com/number-2.jpg', 'Learn to sign the number 2'),
('3', 'number', 'https://example.com/number-3.jpg', 'Learn to sign the number 3'),
-- Words
('Hello', 'word', 'https://example.com/word-hello.jpg', 'Learn to sign hello'),
('Thank you', 'word', 'https://example.com/word-thankyou.jpg', 'Learn to sign thank you');
```

**Note:** Replace image URLs with your actual media storage URLs

---

### ✅ Phase 6: Monitoring & Error Tracking

#### 6.1 Sentry Setup (Optional but Recommended)

1. Go to https://sentry.io
2. Create new project for Next.js
3. Copy Sentry DSN
4. Add to `.env.production`:
   ```
   SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
   ```

#### 6.2 Vercel Analytics

1. Automatic in Vercel dashboard
2. Monitor:
   - Core Web Vitals
   - Build times
   - Deploy status
   - Error rates

---

### ✅ Phase 7: Health Check & Testing

#### 7.1 Health Check Endpoints

```bash
# Test API health
curl https://signflow-production.vercel.app/api/health

# Test auth endpoints
curl -X POST https://signflow-production.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'
```

#### 7.2 Manual Testing Checklist

- [ ] Homepage loads correctly
- [ ] Signup page works without errors
- [ ] Signup creates user in database
- [ ] Login page works without errors
- [ ] Login with new credentials succeeds
- [ ] Dashboard displays user info
- [ ] Practice page loads and fetches lessons
- [ ] Profile page displays user stats
- [ ] Logout works correctly
- [ ] Protected routes redirect to login when not authenticated

---

### ✅ Phase 8: Backup & Recovery

#### 8.1 Supabase Backups

In Supabase Dashboard → Settings → Backups:
1. Enable automatic daily backups
2. Retention: 30 days (Pro plan)
3. Set backup time during low traffic hours

#### 8.2 Database Recovery Procedures

In case of data loss:
1. Go to Supabase Dashboard → Settings → Backups
2. Click "Restore from backup"
3. Select backup date and confirm

---

## 📋 Summary of Deployment Steps

### Quick Reference

```bash
# 1. Prepare repository
cd /workspace/web
git init
git add .
git commit -m "Initial commit: SignFlow platform"
git remote add origin https://github.com/YOUR_USERNAME/signflow.git
git push -u origin main

# 2. Deploy to Vercel
# - Go to vercel.com
# - Import GitHub repository
# - Add environment variables
# - Deploy

# 3. Configure production database
# - Create Supabase production project
# - Execute SQL migration script
# - Seed initial data
# - Disable email confirmation

# 4. Setup custom domain
# - Purchase domain
# - Configure DNS in Vercel
# - Enable SSL

# 5. Test production deployment
# - Verify all pages load
# - Test auth flow
# - Check API endpoints
# - Monitor error logs
```

---

## ✅ Deployment Status

| Phase | Status | Details |
|-------|--------|---------|
| Environment Setup | ✅ Ready | `.env.production` configured |
| Git & Repository | ⏳ Pending | Awaiting GitHub setup |
| Vercel Deployment | ⏳ Pending | Awaiting GitHub repository |
| Database Setup | ⏳ Pending | SQL script ready |
| SSL & Domain | ⏳ Pending | Instructions provided |
| Monitoring | ⏳ Pending | Sentry optional setup |
| Testing | ⏳ Pending | Checklist provided |
| Backup | ⏳ Pending | Supabase auto-backups |

---

## 🎯 Next Steps

1. **Update `.env.production`** with real Supabase credentials
2. **Push to GitHub** and create repository
3. **Deploy to Vercel** by importing GitHub repo
4. **Create production Supabase** project
5. **Execute SQL migration** to create tables
6. **Seed initial lessons** data
7. **Configure domain** and SSL
8. **Run health checks** on all endpoints
9. **Test complete user flow**
10. **Monitor errors** and performance

---

## 📞 Support

For deployment issues:
- Vercel Documentation: https://vercel.com/docs
- Supabase Documentation: https://supabase.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment

---

**Generated:** 2026-04-09
**SignFlow Team**
