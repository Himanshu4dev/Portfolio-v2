Vercel Deployment & Environment Setup

1) Required environment variables
- ADMIN_TOKEN — secret value used for admin login (choose a strong token)
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL, CONTACT_TO_EMAIL — if you want contact form emails to work

2) How to generate a strong admin token (locally)
- Run:
  ```bash
  node scripts/generate-admin-token.js
  ```
- Copy the printed value and set it in Vercel as `ADMIN_TOKEN` (Production + Preview if you want it there)

3) Add env vars in Vercel
- Open Vercel dashboard → your project → Settings → Environment Variables
- Add each key and value, choose the environment(s), and click Save
- Redeploy the project after changes

4) Deployment notes
- Vercel serverless filesystem is ephemeral. The current implementation saves testimonials to `tmp/testimonials.json` on the server. This will work for testing but is not reliable for production.
- For production, use a hosted DB or key-value store. Options:
  - Supabase (Postgres)
  - Vercel KV
  - PlanetScale / Neon
- If you want, I can migrate the testimonials storage to Supabase or Vercel KV.

5) Admin login on the site
- Go to the Testimonials section, click "Admin Login", paste the token you set in Vercel.
- Delete testimonials via UI once logged in.

6) Helpful commands
- Install deps:
  ```bash
  pnpm install
  ```
- Run dev:
  ```bash
  pnpm dev
  ```
- Build for production (locally):
  ```bash
  pnpm build
  ```

7) Security reminders
- Never commit `.env.local` to your repo. Mark it in `.gitignore`.
- Keep `ADMIN_TOKEN` secret in Vercel.

If you'd like, I can migrate testimonials to Supabase and update the API. Tell me which storage option you prefer and I will implement it.