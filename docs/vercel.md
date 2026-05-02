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

**Strongly recommended on Vercel (persistent projects + testimonials)**
- `KV_REST_API_URL` and `KV_REST_API_TOKEN` — added automatically when you connect **Redis (Upstash)** from Vercel Marketplace → Storage
- `USE_IN_MEMORY_STORAGE` — set to `1` to use ephemeral in-memory storage (not persistent) for quick testing
- `SUPABASE_URL` and `SUPABASE_KEY` — alternative option if you prefer Supabase

**Notes**
- With Redis env vars set, the app uses `@vercel/kv` for durable JSON storage for projects and testimonials.
- If the server filesystem is read-only (common in serverless), enable `USE_IN_MEMORY_STORAGE=1` for testing, but migrate to KV or Supabase for production.


4) Deployment notes
- Vercel serverless filesystem is ephemeral. The current implementation saves testimonials to `tmp/testimonials.json` on the server. This will work for testing but is not reliable for production.
- For production, use a hosted DB or key-value store. Options:
  - Supabase (Postgres)
  - Vercel KV
  - PlanetScale / Neon
- If you want, I can migrate the testimonials storage to Supabase or Vercel KV.

## Redis / Upstash (recommended for small datasets)

Redis via Upstash works well for testimonials/projects JSON in this app. To enable it on Vercel:

1. The repo includes `@vercel/kv` (wraps Upstash REST).
2. Vercel dashboard → **Marketplace** → **Storage** → **Redis** → create/link store to this project. Vercel injects `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
3. (Optional) For local development set `USE_IN_MEMORY_STORAGE=1` in `.env.local`, or copy the same Redis env vars into `.env.local`.
4. Redeploy. The API uses Redis when both env vars are set; otherwise it falls back to ephemeral disk under `/tmp` or in-memory storage.

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