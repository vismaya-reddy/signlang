# Supabase Email Rate Limit Fix

## IMMEDIATE FIX: Disable Email Confirmation

Follow these steps in your Supabase Dashboard:

1. Go to: https://app.supabase.com
2. Select your project (fskmhopkzoxwxjioasju)
3. Navigate to: **Authentication** → **Providers** → **Email**
4. Look for **"Confirm email"** toggle
5. **TURN OFF** the "Confirm email" option
6. Click **Save**

This will:
✅ Prevent email confirmation requests from being sent
✅ Auto-verify users on signup
✅ Fix the "Email rate limit exceeded" error
✅ Allow unlimited signups during development

## RATE LIMIT DETAILS

Supabase has these email limits:
- **5 emails per hour** per email address (default)
- **10 emails per minute** total (default)
- Rate limits apply when email confirmation is enabled

## ALTERNATIVE: Clear Cache

If you just signed up with multiple emails:
1. Wait 60 minutes for rate limit to reset
2. OR use a different email address
3. OR create a new Supabase project for testing

## PRODUCTION SETUP

When ready for production:
1. Enable email confirmation
2. Configure custom email templates
3. Add domain verification
4. Set up email delivery service
