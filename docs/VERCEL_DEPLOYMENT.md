# Complete Vercel Deployment Guide

This guide will walk you through deploying your Portfolio v2 application to Vercel with full functionality, including admin features, testimonials, and project management.

## Prerequisites

- A GitHub account
- A Vercel account (sign up at [vercel.com](https://vercel.com) if needed)
- Your portfolio repository pushed to GitHub

## Step 1: Prepare Your Repository

1. **Ensure your code is committed and pushed to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verify your project structure**
   - Make sure `package.json` exists
   - Ensure `next.config.mjs` is configured
   - Check that all necessary files are present

## Step 2: Generate Admin Token

1. **Generate a secure admin token locally:**
   ```bash
   node scripts/generate-admin-token.js
   ```
   
2. **Copy the generated token** - you'll need it for Vercel environment variables

   Example output: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in

2. **Click "Add New Project"**

3. **Import your GitHub repository**
   - Select your Portfolio-v2 repository
   - Click "Import"

4. **Configure Project Settings:**
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `./` (default)
   - **Build Command:** `pnpm build` (or `npm run build` if using npm)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `pnpm install` (or `npm install`)

5. **Click "Deploy"** (we'll add environment variables after first deployment)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project or create new
   - Confirm settings
   - Deploy

## Step 4: Configure Environment Variables

### Critical: Admin Token

1. **Go to Vercel Dashboard → Your Project → Settings → Environment Variables**

2. **Add the following environment variable:**
   - **Key:** `ADMIN_TOKEN`
   - **Value:** (paste the token you generated in Step 2)
   - **Environment:** Select all (Production, Preview, Development)
   - Click "Save"

### Optional: Email Configuration (for Contact Form)

If you want the contact form to send emails, add these variables:

- **SMTP_HOST:** Your SMTP server (e.g., `smtp.gmail.com`)
- **SMTP_PORT:** Port number (e.g., `587`)
- **SMTP_USER:** Your email address
- **SMTP_PASS:** Your email password or app-specific password
- **SMTP_FROM_EMAIL:** Email address to send from
- **CONTACT_TO_EMAIL:** Email address to receive contact form submissions

**Note:** For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an "App Password" (use this as SMTP_PASS)
3. Use `smtp.gmail.com` and port `587`

## Step 5: Redeploy After Environment Variables

1. **After adding environment variables, trigger a new deployment:**
   - Go to "Deployments" tab
   - Click the "..." menu on the latest deployment
   - Select "Redeploy"
   - Or push a new commit to trigger automatic deployment

2. **Wait for deployment to complete** (usually 1-2 minutes)

## Step 6: Verify Deployment

1. **Visit your deployed site** (Vercel will provide a URL like `your-project.vercel.app`)

2. **Test Admin Login:**
   - Navigate to the Testimonials section or Work page
   - Click "Admin Login"
   - Enter your admin token
   - You should be logged in and see delete/edit options

3. **Test Delete Functionality:**
   - While logged in as admin, try deleting a testimonial or project
   - Verify it works correctly

4. **Test Adding Content:**
   - Add a new project via the admin form on the Work page
   - Verify it appears correctly

## Step 7: Configure Custom Domain (Optional)

1. **Go to Project Settings → Domains**

2. **Add your custom domain:**
   - Enter your domain (e.g., `yourportfolio.com`)
   - Follow Vercel's DNS configuration instructions

3. **Update DNS records** as instructed by Vercel

## Important Notes About Data Storage

### Current Implementation (File-based)

Your application currently stores data in JSON files (`tmp/testimonials.json` and `tmp/projects.json`). 

**⚠️ Important Limitations:**
- Vercel's serverless filesystem is **ephemeral**
- Data may be lost between deployments or server restarts
- This is fine for testing but **not recommended for production**

### Production-Ready Solutions

For production, consider migrating to:

1. **Vercel KV** (Redis-based, easy integration)
   - Fast and reliable
   - Good for simple key-value storage
   - Free tier available

2. **Supabase** (PostgreSQL)
   - Full-featured database
   - Free tier available
   - Better for complex queries

3. **PlanetScale** (MySQL)
   - Serverless MySQL
   - Free tier available
   - Great for relational data

**Would you like help migrating to one of these solutions?** Let me know and I can update the code.

## Troubleshooting

### Admin Login Not Working

1. **Check environment variables:**
   - Go to Settings → Environment Variables
   - Verify `ADMIN_TOKEN` is set correctly
   - Ensure it's set for the correct environment (Production/Preview)

2. **Clear browser cookies:**
   - Try logging out and logging back in
   - Use an incognito/private window

3. **Check deployment logs:**
   - Go to Deployments → Click on latest deployment → View Function Logs
   - Look for any errors related to authentication

### Data Not Persisting

- This is expected with file-based storage on Vercel
- Consider migrating to a database (see above)

### Build Errors

1. **Check build logs:**
   - Go to Deployments → Click on failed deployment
   - Review error messages

2. **Common issues:**
   - Missing dependencies: Check `package.json`
   - TypeScript errors: Check `tsconfig.json`
   - Environment variables: Ensure all required vars are set

### Contact Form Not Sending Emails

1. **Verify SMTP credentials:**
   - Check all email-related environment variables
   - Test SMTP settings with a tool like [Mailtrap](https://mailtrap.io)

2. **Check function logs:**
   - Look for SMTP connection errors
   - Verify port and host settings

## Security Best Practices

1. **Never commit `.env.local` or `.env` files**
   - Already in `.gitignore` ✓

2. **Use strong admin tokens**
   - Generated tokens are cryptographically secure ✓

3. **Keep admin token secret**
   - Only share with trusted individuals
   - Rotate if compromised

4. **Use HTTPS**
   - Vercel provides SSL certificates automatically ✓

5. **Regular updates**
   - Keep dependencies updated
   - Monitor security advisories

## Quick Reference Commands

```bash
# Generate admin token
node scripts/generate-admin-token.js

# Local development
pnpm install
pnpm dev

# Build locally
pnpm build

# Start production server locally
pnpm start

# Deploy to Vercel (if using CLI)
vercel

# Deploy to production (if using CLI)
vercel --prod
```

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review environment variables
3. Test locally first (`pnpm dev`)
4. Check Next.js documentation
5. Review Vercel documentation

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure environment variables
3. ✅ Test admin functionality
4. ⚠️ Consider migrating to a database for production
5. ⚠️ Set up custom domain (optional)
6. ⚠️ Configure email service (optional)

---

**Your portfolio is now live! 🎉**

Visit your Vercel URL and start managing your content with admin login.

