# 🔧 Fix: Email Rate Limit Exceeded Error

## ⚠️ Root Cause
Supabase Auth has email confirmation enabled, which triggers rate limiting:
- **5 emails/hour per email address** (default limit)
- **10 emails/minute total**
- Each signup attempt sends a confirmation email

## ✅ SOLUTION: Disable Email Confirmation

### Step 1: Access Supabase Dashboard
1. Go to https://app.supabase.com
2. Sign in with your account
3. Select your project: **SignFlow** (ID: fskmhopkzoxwxjioasju)

### Step 2: Disable Email Confirmation
1. Click **Authentication** (left sidebar)
2. Click **Providers**
3. Click **Email**
4. Find the toggle: **"Confirm email"**
5. **TURN IT OFF** (toggle should be gray/disabled)
6. Click **Save** button at bottom

### Step 3: Verify Settings
The Email provider settings should now show:
- ✅ "Confirm email" = **OFF**
- ✅ Email confirmations will NOT be sent
- ✅ Users auto-verified on signup

### Step 4: Clear Rate Limit
- If rate limit still active, wait 60 minutes OR
- Use a different email for testing OR
- Create a new Supabase project

## 🧪 Testing After Fix

Try signup with:
- Email: test@example.com
- Password: Test1234!
- Name: Test User

You should NOT see the "Email rate limit exceeded" error anymore.

## 📊 Rate Limit Details

| Setting | Development | Production |
|---------|-------------|------------|
| Email Confirmation | ❌ OFF | ✅ ON |
| Auto-verify Users | ✅ YES | ❌ NO |
| Rate Limit Enforced | ❌ NO | ✅ YES |
| Users Can Signup | ✅ Unlimited | ⚠️ 5/hour |

## 🚀 Production Configuration

When deploying to production:
1. **Enable email confirmation** in Supabase
2. **Configure email templates** (Supabase dashboard)
3. **Set custom domain** (email settings)
4. **Add authorized redirect URLs** (Authentication > URL Configuration)
5. Users will receive confirmation emails on signup

## 💡 Alternative: Use Different Email

If you want to test without changing settings:
1. Each email has a 5/hour rate limit
2. Use different emails: test1@, test2@, test3@, etc.
3. Wait 60 minutes for limit to reset
4. Use email aliases: test+1@, test+2@, etc.

## 🆘 Still Getting Error?

If issue persists after disabling email confirmation:
1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Restart dev server** (Ctrl+C, then npm run dev)
3. **Check .env.local** has correct Supabase credentials
4. **Wait 2-3 minutes** for changes to propagate
