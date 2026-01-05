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

**Required**
- `ADMIN_TOKEN` — secret used for admin login

**Optional but recommended**
- `VERCEL_KV_URL` and `VERCEL_KV_TOKEN` — credentials for Vercel KV (recommended for production storage)
- `USE_IN_MEMORY_STORAGE` — set to `1` to use ephemeral in-memory storage (not persistent) for quick testing
- `SUPABASE_URL` and `SUPABASE_KEY` — alternative option if you prefer Supabase

**Notes**
- If you enable Vercel KV, the app will automatically use it (no code changes required beyond installing `@vercel/kv` if running locally).
- If the server filesystem is read-only (common in serverless), enable `USE_IN_MEMORY_STORAGE=1` for testing, but migrate to KV or Supabase for production.


4) Deployment notes
- Vercel serverless filesystem is ephemeral. The current implementation saves testimonials to `tmp/testimonials.json` on the server. This will work for testing but is not reliable for production.
- For production, use a hosted DB or key-value store. Options:
  - Supabase (Postgres)
  - Vercel KV
  - PlanetScale / Neon
- If you want, I can migrate the testimonials storage to Supabase or Vercel KV.

## Vercel KV (recommended for small datasets)

Vercel KV is a simple managed key-value store that works well for testimonials/projects in this app. To enable it on Vercel:

1. Add the `@vercel/kv` package locally: `pnpm add @vercel/kv`.
2. In the Vercel dashboard, create a KV instance and add the provided credentials as environment variables: `VERCEL_KV_URL` and `VERCEL_KV_TOKEN`.
3. (Optional) For local development set `USE_IN_MEMORY_STORAGE=1` in `.env.local` to avoid writing to `tmp/`.
4. Redeploy. The API automatically uses KV when `VERCEL_KV_URL` is present and falls back to `tmp/*.json` files or in-memory storage when configured.

If you'd like, I can finish the setup and deploy it to your Vercel project — I will need access to set the Vercel env vars (or you can set them and tell me when done).

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