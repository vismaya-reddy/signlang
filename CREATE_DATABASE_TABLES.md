# 📊 Create Database Tables in Supabase

## 🎯 The Problem
Error: "Could not find the table 'public.users_profile' in the schema cache"

**Reason**: The database tables haven't been created yet in Supabase.

## ✅ SOLUTION: Execute SQL in Supabase Dashboard

### Step 1: Go to Supabase SQL Editor
1. Open: https://app.supabase.com
2. Select your project: **SignFlow**
3. Left sidebar → **SQL Editor**
4. Click **New Query**

### Step 2: Copy and Paste SQL

Copy the entire SQL script below and paste it into the SQL Editor:

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

-- Enable Row Level Security (RLS)
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for users_profile
CREATE POLICY "Users can view their own profile" ON public.users_profile
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.users_profile
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.users_profile
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS Policies for user_progress
CREATE POLICY "Users can view their own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_users_profile_user_id ON public.users_profile(user_id);
CREATE INDEX IF NOT EXISTS idx_users_profile_email ON public.users_profile(email);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON public.user_progress(lesson_id);
```

### Step 3: Run the Query
1. Click **Run** button (or press Ctrl+Enter)
2. Wait for execution to complete
3. You should see: "Query executed successfully" ✅

### Step 4: Verify Tables Created
1. Left sidebar → **Table Editor**
2. You should see:
   - ✅ **users_profile** table
   - ✅ **user_progress** table

---

## 📋 What These Tables Do

### users_profile
Stores user account data:
- `user_id` - Links to Supabase Auth user
- `name` - User's full name
- `email` - User's email address
- `level` - Current learning level (1-100)
- `xp` - Experience points earned
- `current_streak` - Days practiced in a row
- `longest_streak` - Best streak ever
- `total_lessons_completed` - Number of lessons finished

### user_progress
Tracks lesson completion:
- `user_id` - Which user
- `lesson_id` - Which lesson
- `completed` - Whether lesson finished
- `accuracy_score` - Score out of 100
- `attempts` - Number of tries
- `completed_at` - When it was finished

---

## 🔐 Row Level Security (RLS)

All tables have RLS enabled:
- ✅ Users can only see their own data
- ✅ Users can only update their own data
- ✅ Users can only insert their own data
- ✅ No cross-user data leaks

---

## 🚀 After Creating Tables

Once tables are created:

1. Test signup at: https://lost-written-beaver.3000.dev.raccoonai.tech/signup
2. Create a test account
3. Check dashboard for user data ✅

---

## ⏱️ Expected Time: 2 minutes

1. Open Supabase → SQL Editor (30 seconds)
2. Paste SQL script (30 seconds)
3. Run query (30 seconds)
4. Verify tables created (30 seconds)

---

## 🆘 Troubleshooting

**If you get "already exists" error:**
- Script uses `IF NOT EXISTS` - safe to run multiple times
- Just click Run again

**If tables don't appear:**
- Refresh browser (F5)
- Refresh in Table Editor
- Wait 10 seconds

**If SQL fails:**
- Check for typos
- Ensure you're in right project
- Check Supabase project is active

---

## ✅ Checklist

- [ ] Open https://app.supabase.com
- [ ] Select SignFlow project
- [ ] Go to SQL Editor
- [ ] Click New Query
- [ ] Paste entire SQL script above
- [ ] Click Run
- [ ] See "Query executed successfully"
- [ ] Go to Table Editor
- [ ] Verify users_profile table exists
- [ ] Verify user_progress table exists
- [ ] Test signup on dev URL
- [ ] Done! 🎉

